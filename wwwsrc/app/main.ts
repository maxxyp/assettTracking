/// <reference path="../typings/app.d.ts" />

import {Aurelia} from "aurelia-framework";
import {Startup} from "./common/core/startup";
import {Container} from "aurelia-dependency-injection";
import {BasicHttpClient} from "./common/core/basicHttpClient";
import {SimulationClient} from "./common/simulation/simulationClient";
import {WuaHttpClient} from "./common/core/wuaHttpClient";
import {PlatformHelper} from "./common/core/platformHelper";
import {HttpClient} from "./common/core/httpClient";

export function configure(aurelia: Aurelia): Promise<Aurelia> {
    setupResilientClients(aurelia);

    return Startup.configure(aurelia, [
        "common/ui/services/helpOverlayService/helpOverlay",
        "common/ui/services/helpOverlayService/helpOverlayAdmin",
        "common/ui/converters/stringifyValueConverter",
        "common/ui/converters/dateFormatValueConverter",
        "common/ui/converters/dateTimeFormatValueConverter",
        "common/ui/converters/htmlFormatValueConverter",
        "common/ui/converters/sortValueConverter",
        "common/ui/converters/limitValueConverter",
        "common/ui/converters/groupByValueConverter",
        "common/ui/converters/sanitizeSpecialCharactersValueConverter",
        "common/ui/converters/daysDisplayValueConverter",
        "common/ui/attributes/hideKeyboardOnEnter",
        "common/ui/attributes/numericOnly",
        "common/ui/attributes/timeOnly",
        "common/ui/attributes/cancelDefaultSubmit",
        "common/ui/attributes/formManager",
        "common/ui/attributes/fixHeader",
        "common/ui/elements/accordion",
        "common/ui/elements/buttonList",
        "common/ui/elements/checkbox",
        "common/ui/elements/collapsible",
        "common/ui/elements/datePicker",
        "common/ui/elements/dropDown",
        "common/ui/elements/footerNav",
        "common/ui/elements/formManagerArrayMap",
        "common/ui/elements/helpTip",
        "common/ui/elements/navBarMenu",
        "common/ui/elements/pleaseWait",
        "common/ui/elements/progressBar",
        "common/ui/elements/starRating",
        "common/ui/elements/toggle",
        "common/ui/elements/numberBox",
        "common/ui/elements/timePicker",
        "common/ui/elements/timeRangePicker",
        "common/ui/elements/textArea",
        "common/ui/elements/textBox",
        "common/ui/elements/buttonList",
        "common/ui/elements/toastManager",
        "common/ui/elements/incrementalNumberPicker",
        "common/ui/elements/numberAdjuster",
        "common/ui/elements/editableDropdown",
        "common/ui/elements/badge",
        "hema/core/elements/timePicker2",
        "hema/presentation/elements/navSections/iconNavBar",
        "hema/presentation/elements/navSections/navBar",
        "hema/presentation/elements/stateButtons",
        "hema/presentation/elements/navigation/fullscreen",
        "hema/presentation/elements/navigation/prevNextButtons",
        "hema/presentation/elements/navigation/tabButtons",
        "hema/presentation/elements/catalogLookup",
        "hema/presentation/elements/engineerState",
        "hema/presentation/elements/yesNoButtonList",
        "hema/presentation/elements/task-appliance.html",
        "hema/presentation/elements/task-charge.html",
        "hema/presentation/elements/task-description.html",
        "hema/presentation/elements/task-support-info.html",
        "hema/presentation/elements/task-job.html",
        "hema/presentation/elements/task-action.html",
        "hema/presentation/elements/worklistNotification",
        "hema/presentation/converters/dataStateStyleValueConverter",
        "hema/presentation/converters/secondsToTimeValueConverter",
        "hema/presentation/converters/chargeTypeToServiceLevelCodeValueConverter",
        "hema/presentation/converters/engineerStatusStyleValueConverter",
        "hema/presentation/converters/numberToBigNumberValueConverter",
        "hema/presentation/elements/viewState",
        "hema/presentation/converters/numberToCurrencyValueConverter"
    ], null);
}

function setupResilientClients(aurelia: Aurelia): void {
    aurelia.container.registerSingleton("HttpClient", () => {
        return Container.instance.get(PlatformHelper.getPlatform() === "wua" ? WuaHttpClient : HttpClient);
    });
    aurelia.container.registerSingleton("BasicHttpClient", () => Container.instance.get(BasicHttpClient));
    aurelia.container.registerSingleton("SimulationClient", () => Container.instance.get(SimulationClient));
}
