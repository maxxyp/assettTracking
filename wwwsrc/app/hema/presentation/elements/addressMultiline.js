define(["require", "exports", "../../core/customerHelper"], function (require, exports, customerHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddressMultiline = /** @class */ (function () {
        function AddressMultiline() {
        }
        AddressMultiline.prototype.activate = function (address) {
            this.addressLines = [];
            if (!address) {
                return;
            }
            this.addressLines = customerHelper_1.CustomerHelper.getAddressLines(address);
            if (address.town && address.town !== "") {
                this.addressLines.push(address.town);
            }
            if (address.county && address.county !== "") {
                this.addressLines.push(address.county);
            }
            if (address.postCode && address.postCode !== "") {
                this.addressLines.push(address.postCode);
            }
            if (address.country && address.country !== "") {
                this.addressLines.push(address.country);
            }
        };
        return AddressMultiline;
    }());
    exports.AddressMultiline = AddressMultiline;
});

//# sourceMappingURL=addressMultiline.js.map
