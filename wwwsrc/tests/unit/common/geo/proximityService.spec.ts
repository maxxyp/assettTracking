/// <reference path="../../../../typings/app.d.ts" />

import {ProximityService} from "../../../../app/common/geo/proximityService";
import {IGpsService} from "../../../../app/common/geo/IGpsService";
import {GeoPosition} from "../../../../app/common/geo/models/geoPosition";

describe("the ProximityService module", () => {
    let proximityService: ProximityService;
    let sandbox: Sinon.SinonSandbox;
    let gpsServiceStub: IGpsService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        gpsServiceStub = <IGpsService>{};
        gpsServiceStub.getLocation = sandbox.stub().returns(Promise.resolve());
        proximityService = new ProximityService(gpsServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(proximityService).toBeDefined();
    });

    it("startMonitoringDistance, success", () => {
        let pos: GeoPosition = new GeoPosition(-1.158961, 52.597176);
        gpsServiceStub.getLocation = sandbox.stub().returns(Promise.resolve(pos));
        let dest: GeoPosition = new GeoPosition(-1.141494, 52.61647);
        proximityService.startMonitoringDistance(dest, 0);
        proximityService.stopMonitoringDistance();
    });

    it("startMonitoringDistance, getLocation failed, resolves", () => {
        let pos: GeoPosition = new GeoPosition(-1.158961, 52.597176);
        gpsServiceStub.getLocation = sandbox.stub().rejects(pos);
        let dest: GeoPosition = new GeoPosition(-1.141494, 52.61647);
        proximityService.startMonitoringDistance(dest, 10);
        proximityService.stopMonitoringDistance();
    });

    it("getDistance returns distance to be null", () => {
        let distance: number = proximityService.getDistance();
        expect(distance).toBeNull();
    });

    it("stopMonitoringDistance when timerId is not defined", () => {
        proximityService.stopMonitoringDistance();
    });
});
