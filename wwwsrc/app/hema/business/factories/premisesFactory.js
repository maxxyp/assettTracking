var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./addressFactory", "../models/premises"], function (require, exports, aurelia_framework_1, addressFactory_1, premises_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PremisesFactory = /** @class */ (function () {
        function PremisesFactory(addressFactory) {
            this._addressFactory = addressFactory;
        }
        PremisesFactory.prototype.createPremisesBusinessModel = function (premisesApiModel) {
            var premisesBusinessModel = new premises_1.Premises();
            if (premisesApiModel) {
                premisesBusinessModel.id = premisesApiModel.id;
                premisesBusinessModel.accessInfo = premisesApiModel.specialAccessInstructions;
                // todo - Data Mapping - currently unused
                // premisesApiModel.previousVisitCount;
                // premisesApiModel.chirpAICode
                /* These are converted externally by additional factories called from the JobFactory
                premisesApiModel.contact */
                if (premisesApiModel.address) {
                    premisesBusinessModel.address = this._addressFactory.createAddressBusinessModel(premisesApiModel.address);
                }
            }
            return premisesBusinessModel;
        };
        PremisesFactory.prototype.createPremisesApiModel = function (premisesBusinessModel) {
            var premisesApiModel = {};
            if (premisesBusinessModel) {
                premisesApiModel.id = premisesBusinessModel.id;
                if (premisesBusinessModel.address) {
                    premisesApiModel.address = this._addressFactory.createAddressApiModel(premisesBusinessModel.address);
                }
            }
            return premisesApiModel;
        };
        PremisesFactory = __decorate([
            aurelia_framework_1.inject(addressFactory_1.AddressFactory),
            __metadata("design:paramtypes", [Object])
        ], PremisesFactory);
        return PremisesFactory;
    }());
    exports.PremisesFactory = PremisesFactory;
});

//# sourceMappingURL=premisesFactory.js.map
