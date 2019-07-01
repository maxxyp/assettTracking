define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CustomerHelper = /** @class */ (function () {
        function CustomerHelper() {
        }
        CustomerHelper.formatCustomerContact = function (contact) {
            var contactParts = [];
            if (contact.title) {
                contactParts.push(contact.title);
            }
            if (contact.firstName) {
                contactParts.push(contact.firstName);
            }
            if (contact.middleName) {
                contactParts.push(contact.middleName);
            }
            if (contact.lastName) {
                contactParts.push(contact.lastName);
            }
            return contactParts.join(" ");
        };
        CustomerHelper.formatCustomerAddress = function (premises) {
            var parts = [];
            var lines = CustomerHelper.getAddressLines(premises.address);
            if (lines && lines.length > 0) {
                parts.push(lines[0]);
            }
            if (premises.address.postCode) {
                parts.push(premises.address.postCode);
            }
            return parts.join(", ");
        };
        CustomerHelper.getAddressLines = function (address) {
            var addressLines = [];
            if (address) {
                if (address.premisesName) {
                    addressLines.push(address.premisesName);
                }
                var line = address.houseNumber || address.flatNumber || "";
                if (address.line && address.line.length > 0 && address.line[0].length > 0) {
                    line += " " + address.line[0];
                    line = line.trim();
                }
                if (line.length > 0) {
                    addressLines.push(line);
                }
                if (address.line && address.line.length > 1 && address.line[1].length > 0) {
                    addressLines.push(address.line[1]);
                }
            }
            return addressLines;
        };
        return CustomerHelper;
    }());
    exports.CustomerHelper = CustomerHelper;
});

//# sourceMappingURL=customerHelper.js.map
