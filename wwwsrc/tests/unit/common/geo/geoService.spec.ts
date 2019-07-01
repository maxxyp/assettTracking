/// <reference path="../../../../typings/app.d.ts" />

import {GeoService} from "../../../../app/common/geo/geoService";
import { IGeoService } from "../../../../app/common/geo/IGeoService";
import { DistanceTime } from "../../../../app/common/geo/models/distanceTime";

describe("the GeoService module", () => {

    beforeEach(() => {
        this.sandbox = sinon.sandbox.create();

        this.geoService = new GeoService();
        this.getDistanceTimeStub = this.sandbox.stub().resolves(new DistanceTime());
        this.launchMapStub = this.sandbox.stub().resolves(null);
        this.launchDirectionsStub = this.sandbox.stub().resolves(null);

        this.geoService.loadModule = () => Promise.resolve(<IGeoService>{
            getDistanceTime: this.getDistanceTimeStub,
            launchMap: this.launchMapStub,
            launchDirections: this.launchDirectionsStub
        });
    });

    afterEach(() => {
        this.sandbox.restore();
    });

    it("can be created", () => {
        expect(this.geoService).toBeDefined();
    });

    describe("getDistanceTime", () => {

        beforeEach((done) => {
            this.geoService.getDistanceTime("origin", "destination").then(done);
        });

        it ("should call platform specific module", () => { 
            expect(this.getDistanceTimeStub.alwaysCalledWith("origin", "destination")).toEqual(true);
        });

        it ("should call cache the original request", (done) => {
            this.geoService.getDistanceTime("origin", "destination")
                .then(() => {
                    expect(this.getDistanceTimeStub.callCount).toEqual(1);
                    done();
                });
        });

    });

    describe("launchMap", () => {

        beforeEach((done) => {
            this.geoService.launchMap("origin").then(done);
        });

        it ("should call platform specific module", () => { 
            expect(this.launchMapStub.alwaysCalledWith("origin")).toEqual(true);
        });

    });

    describe("launchDirections", () => {

        beforeEach((done) => {
            this.geoService.launchDirections("origin", "destination").then(done);
        });

        it ("should call platform specific module", () => { 
            expect(this.launchDirectionsStub.alwaysCalledWith("origin", "destination")).toEqual(true);
        });

    });


});
