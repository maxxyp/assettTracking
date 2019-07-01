/// <reference path="../typings/app.d.ts" />
define(["require", "exports", "./common/core/startup", "aurelia-dependency-injection", "./common/core/basicHttpClient", "./common/simulation/simulationClient", "./common/core/wuaHttpClient", "./common/core/platformHelper", "./common/core/httpClient"], function (require, exports, startup_1, aurelia_dependency_injection_1, basicHttpClient_1, simulationClient_1, wuaHttpClient_1, platformHelper_1, httpClient_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        setupResilientClients(aurelia);
        return startup_1.Startup.configure(aurelia, [
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
    exports.configure = configure;
    function setupResilientClients(aurelia) {
        aurelia.container.registerSingleton("HttpClient", function () {
            return aurelia_dependency_injection_1.Container.instance.get(platformHelper_1.PlatformHelper.getPlatform() === "wua" ? wuaHttpClient_1.WuaHttpClient : httpClient_1.HttpClient);
        });
        aurelia.container.registerSingleton("BasicHttpClient", function () { return aurelia_dependency_injection_1.Container.instance.get(basicHttpClient_1.BasicHttpClient); });
        aurelia.container.registerSingleton("SimulationClient", function () { return aurelia_dependency_injection_1.Container.instance.get(simulationClient_1.SimulationClient); });
    }
});

//# sourceMappingURL=main.js.map
