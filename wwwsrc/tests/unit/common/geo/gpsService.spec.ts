/// <reference path="../../../../typings/app.d.ts" />

import {GpsService} from "../../../../app/common/geo/gpsService";
describe("the GpsService module", () => {
    let sandbox: Sinon.SinonSandbox;
    let gpsService: GpsService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        gpsService = new GpsService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(gpsService).toBeDefined();
    });

    it("can get postCodes", (done) => {
        let navigatorStub = {
            geolocation: {
                clearWatch: (watchId: number) : void => {},
                getCurrentPosition: (successCallback: PositionCallback,
                                     errorCallback?: PositionErrorCallback,
                                     options?: PositionOptions) : void => {
                    let coords: Position = {
                        coords: {
                            accuracy: 0,
                            altitude: 0,
                            altitudeAccuracy: 0,
                            heading: 0,
                            latitude: 0,
                            longitude: 1,
                            speed: 0
                        },
                        timestamp: 0
                    };

                    successCallback(coords);
                },
                watchPosition: (successCallback: PositionCallback,
                                errorCallback?: PositionErrorCallback,
                                options?: PositionOptions): number => { return 0; }
            }};

        gpsService.setNavigator(<Navigator>navigatorStub);
        gpsService.getLocation().then((position) => {
            expect(position).toBeNull();
            done();
        });
    });

    it("can fail postCodes", (done) => {
        let navigatorStub = {
            geolocation: {
                clearWatch: (watchId: number): void => {
                },
                getCurrentPosition: (successCallback: PositionCallback,
                                     errorCallback?: PositionErrorCallback,
                                     options?: PositionOptions): void => {
                    let error: PositionError = {
                        code: 100,
                        message: "GPS Unavailable",
                        PERMISSION_DENIED: 0,
                        POSITION_UNAVAILABLE: 1,
                        TIMEOUT: 2
                    };

                    errorCallback(error);
                },
                watchPosition: (successCallback: PositionCallback,
                                errorCallback?: PositionErrorCallback,
                                options?: PositionOptions): number => {
                    return 0;
                }
            }
        };

        gpsService.setNavigator(<Navigator>navigatorStub);
        gpsService.getLocation().then((position) => {
            expect(position).toBeNull();
            done();
        });
    });

    it("navigator is null", (done) => {
        let navigatorStub: { geolocation: any} = { geolocation: { clearWatch: (watchId: number): void => {}}, };
        gpsService.setNavigator(<Navigator>navigatorStub);
        gpsService.getLocation().then((position) => {
            expect(position).toBeNull();
            done();
        });
    });

    it("navigator not available", (done) => {
        if (navigator.userAgent.indexOf("PhantomJS") > 0) {
            (<any>navigator).geolocation = null;

            gpsService.getLocation().then((position) => {
                expect(position).toBeNull();
                done();
            });
        } else {
            done();
        }
    });
});
