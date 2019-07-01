/// <reference path="../../../../../../../typings/app.d.ts" />

import { PreferencesSetup } from "./preferencesSetup.spec";

describe("the Preferences module", () => {

    beforeEach(() => {
        this.preferences = PreferencesSetup.start();
    });

    it("should be defined", (done) => {
        this.preferences
            .then(PreferencesSetup.setupUserSetting)
            .then(PreferencesSetup.getPreferences)
            .then(preferences => {
                expect(preferences).toBeDefined();
                done();
            });
    });

    it("should not show training settings with no scenario data", (done) => {
         this.preferences
            .then(PreferencesSetup.setupUserSetting)
            .then(PreferencesSetup.disableDeveloperMode)
            .then(PreferencesSetup.getPreferences)
            .then(PreferencesSetup.activateAsync)
            .then(preferences => {
                expect(preferences.showSimulation).toEqual(false);
                done();
            });
    });

    it("should show training settings if scenarios are available", (done) => {
         this.preferences
            .then(PreferencesSetup.setupUserSetting)
            .then(PreferencesSetup.disableDeveloperMode)
            .then(PreferencesSetup.addTrainingScenarios)
            .then(PreferencesSetup.getPreferences)
            .then(PreferencesSetup.activateAsync)
            .then(preferences => {
                expect(preferences.showSimulation).toEqual(true);
                done();
            });
    });

    it("should show training options if app is in develop mode", (done) => {
         this.preferences
            .then(PreferencesSetup.setupUserSetting)
            .then(PreferencesSetup.enableDeveloperMode)
            .then(PreferencesSetup.getPreferences)
            .then(PreferencesSetup.activateAsync)
            .then(preferences => {
                expect(preferences.showSimulation).toEqual(true);
                done();
            });
    });

    it("can deativate", (done) => {
         this.preferences
            .then(PreferencesSetup.setupUserSetting)
            .then(PreferencesSetup.setUserSettingComplete)
            .then(PreferencesSetup.getPreferences)
            .then(PreferencesSetup.activateAsync)
            .then(preferences => {
                preferences.canDeactivateAsync().then(() => {
                    done();
                });
            });
    });
    
});
