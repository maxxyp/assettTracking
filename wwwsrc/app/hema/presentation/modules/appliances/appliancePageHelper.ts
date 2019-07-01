import { NamedRedirect } from "../../../../common/ui/namedRedirect";
import { ApplianceSafetyType } from "../../../business/models/applianceSafetyType";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { Redirect } from "aurelia-router";

export class AppliancePageHelper  {

    // #16497 DF_1058 - using prevNext buttons, we may find ourselves e.g. on a gas appliance-specific page but with an electric appliance in data
    public static checkApplianceSafetyType(applianceService: IApplianceService, canActivateParams: any[]): Promise<boolean | Redirect > {

        let routeSettingsObj = canActivateParams
            && canActivateParams[1] // this is route config
            && canActivateParams[1].settings;

        let routeParamsObj = canActivateParams
            && canActivateParams[0];

        if (routeSettingsObj && routeParamsObj) {

            let jobId: string = routeParamsObj.jobId;
            let applianceId: string = routeParamsObj.applianceId;
            let routeApplianceSafetyType: ApplianceSafetyType = routeSettingsObj.applianceSafetyType;
            let routeHideIfInstPrem: boolean = routeSettingsObj.hideIfInstPrem;

            if (jobId && applianceId && routeApplianceSafetyType && applianceService) {
                return applianceService.getAppliance(jobId, applianceId)
                    .then(appliance => {

                        let isWrongApplianceTypeForPage = appliance && appliance.applianceSafetyType !== routeApplianceSafetyType;
                        let isInstPremAppliance = appliance && appliance.isInstPremAppliance && routeHideIfInstPrem;

                            /* Using "appliance" route rather than "appliance-details" for a good reason:
                            if you use "appliance-details" and navigate using navButtons, you get redirected to the
                            details page of the appliance you are navigating from, not the one you are navigating to
                            */
                            return isWrongApplianceTypeForPage || isInstPremAppliance
                                ? new NamedRedirect("appliance", {applianceId}, {useChildRouter: true, trigger: true})
                                : true;
                    }
                );
            }
        }
        return Promise.resolve(true);
    }
}
