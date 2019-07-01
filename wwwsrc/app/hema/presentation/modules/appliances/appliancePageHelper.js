define(["require", "exports", "../../../../common/ui/namedRedirect"], function (require, exports, namedRedirect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppliancePageHelper = /** @class */ (function () {
        function AppliancePageHelper() {
        }
        // #16497 DF_1058 - using prevNext buttons, we may find ourselves e.g. on a gas appliance-specific page but with an electric appliance in data
        AppliancePageHelper.checkApplianceSafetyType = function (applianceService, canActivateParams) {
            var routeSettingsObj = canActivateParams
                && canActivateParams[1] // this is route config
                && canActivateParams[1].settings;
            var routeParamsObj = canActivateParams
                && canActivateParams[0];
            if (routeSettingsObj && routeParamsObj) {
                var jobId = routeParamsObj.jobId;
                var applianceId_1 = routeParamsObj.applianceId;
                var routeApplianceSafetyType_1 = routeSettingsObj.applianceSafetyType;
                var routeHideIfInstPrem_1 = routeSettingsObj.hideIfInstPrem;
                if (jobId && applianceId_1 && routeApplianceSafetyType_1 && applianceService) {
                    return applianceService.getAppliance(jobId, applianceId_1)
                        .then(function (appliance) {
                        var isWrongApplianceTypeForPage = appliance && appliance.applianceSafetyType !== routeApplianceSafetyType_1;
                        var isInstPremAppliance = appliance && appliance.isInstPremAppliance && routeHideIfInstPrem_1;
                        /* Using "appliance" route rather than "appliance-details" for a good reason:
                        if you use "appliance-details" and navigate using navButtons, you get redirected to the
                        details page of the appliance you are navigating from, not the one you are navigating to
                        */
                        return isWrongApplianceTypeForPage || isInstPremAppliance
                            ? new namedRedirect_1.NamedRedirect("appliance", { applianceId: applianceId_1 }, { useChildRouter: true, trigger: true })
                            : true;
                    });
                }
            }
            return Promise.resolve(true);
        };
        return AppliancePageHelper;
    }());
    exports.AppliancePageHelper = AppliancePageHelper;
});

//# sourceMappingURL=appliancePageHelper.js.map
