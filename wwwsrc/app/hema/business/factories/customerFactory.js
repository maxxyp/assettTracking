var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../models/customerContact", "./addressFactory", "aurelia-framework"], function (require, exports, customerContact_1, addressFactory_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CustomerFactory = /** @class */ (function () {
        function CustomerFactory(addressFactory) {
            this._addressFactory = addressFactory;
        }
        CustomerFactory.prototype.createCustomerContactBusinessModel = function (customerApiModel) {
            var customerContactBusinessModel = new customerContact_1.CustomerContact();
            if (customerApiModel) {
                customerContactBusinessModel.id = customerApiModel.id;
                customerContactBusinessModel.password = customerApiModel.password;
                customerContactBusinessModel.initials = customerApiModel.initials;
                customerContactBusinessModel.title = customerApiModel.title;
                customerContactBusinessModel.firstName = customerApiModel.firstName;
                customerContactBusinessModel.middleName = customerApiModel.middleName;
                customerContactBusinessModel.lastName = customerApiModel.lastName;
                customerContactBusinessModel.homePhone = customerApiModel.homePhone;
                customerContactBusinessModel.workPhone = customerApiModel.workPhone;
                if (customerApiModel.address) {
                    customerContactBusinessModel.address = this._addressFactory.createAddressBusinessModel(customerApiModel.address);
                }
            }
            return customerContactBusinessModel;
        };
        CustomerFactory = __decorate([
            aurelia_framework_1.inject(addressFactory_1.AddressFactory),
            __metadata("design:paramtypes", [Object])
        ], CustomerFactory);
        return CustomerFactory;
    }());
    exports.CustomerFactory = CustomerFactory;
});

//# sourceMappingURL=customerFactory.js.map
