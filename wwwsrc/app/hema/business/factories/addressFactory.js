define(["require", "exports", "../models/address"], function (require, exports, address_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddressFactory = /** @class */ (function () {
        function AddressFactory() {
        }
        AddressFactory.prototype.createAddressBusinessModel = function (addressApiModel) {
            var addressBusinessModel = new address_1.Address();
            if (addressApiModel) {
                addressBusinessModel.premisesName = addressApiModel.premisesName;
                addressBusinessModel.houseNumber = addressApiModel.houseNumber;
                addressBusinessModel.flatNumber = addressApiModel.flatNumber;
                addressBusinessModel.line = addressApiModel.line;
                addressBusinessModel.town = addressApiModel.town;
                addressBusinessModel.county = addressApiModel.county;
                addressBusinessModel.postCodeOut = addressApiModel.postCodeOut;
                addressBusinessModel.postCodeIn = addressApiModel.postCodeIn;
                if (addressApiModel.postCodeIn && addressBusinessModel.postCodeOut) {
                    addressBusinessModel.postCode = addressApiModel.postCodeOut + " " + addressApiModel.postCodeIn;
                }
                addressBusinessModel.country = addressApiModel.country;
            }
            return addressBusinessModel;
        };
        AddressFactory.prototype.createAddressApiModel = function (addressBusinessModel) {
            return {};
        };
        return AddressFactory;
    }());
    exports.AddressFactory = AddressFactory;
});

//# sourceMappingURL=addressFactory.js.map
