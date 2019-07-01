/// <reference path="../../../../../../../typings/app.d.ts" />

import { SimulationPreferencesSetup as Setup } from "./simulationPreferencesSetup.spec";
import { SimulationPreferences } from "../../../../../../../app/hema/presentation/modules/settings/preferences/simulationPreferences";

describe("the Simulation Preferences module", () => {

    beforeEach(() => {
        this.preferences = Setup.start();
    });
 
    it("can attach", (done) => {
        this.preferences
            .then(Setup.getPreferences)
            .then(Setup.activate)
            .then((preferencactivatees: SimulationPreferences) => {
                done();
            });
    });

    it("with NO stored engineer doesn't setup any engineers", (done) => {
        this.preferences
            .then(Setup.addTrainingScenarios)
            .then(Setup.getPreferences)
            .then(Setup.activate)
            .then((preferences: SimulationPreferences) => {
                expect(preferences.customEngineerId).toBeUndefined();
                expect(preferences.engineerId).toBeUndefined();
                done();
            });
    });

    it("with MATCHING stored engineer sets engineer id", (done) => {
        this.preferences
            .then(s => Setup.addSimulatedEngineerToStorage(s, "1111111"))
            .then(Setup.addTrainingScenarios)
            .then(Setup.getPreferences)
            .then(Setup.activate)
            .then((preferences: SimulationPreferences) => {
                expect(preferences.customEngineerId).toBeUndefined();
                expect(preferences.engineerId).toEqual("1111111");
                done();
            });
    });

    it("with MIS-MATCHED stored engineer sets custom engineer id", (done) => {
        this.preferences
            .then(s => Setup.addSimulatedEngineerToStorage(s, "nomatch"))
            .then(Setup.addTrainingScenarios)
            .then(Setup.getPreferences)
            .then(Setup.activate)
            .then((preferences: SimulationPreferences) => {
                expect(preferences.customEngineerId).toEqual("nomatch");
                expect(preferences.engineerId).toBeUndefined();
                done();
            });
    });

});
