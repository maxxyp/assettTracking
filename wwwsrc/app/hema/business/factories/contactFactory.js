define(["require", "exports", "../models/contact"], function (require, exports, contact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContactFactory = /** @class */ (function () {
        function ContactFactory() {
        }
        ContactFactory.prototype.createContactBusinessModel = function (contactApiModel) {
            var contactBusinessModel = new contact_1.Contact();
            if (contactApiModel) {
                contactBusinessModel.id = contactApiModel.id;
                contactBusinessModel.password = contactApiModel.password;
                contactBusinessModel.title = contactApiModel.title;
                contactBusinessModel.firstName = contactApiModel.firstName;
                contactBusinessModel.middleName = contactApiModel.middleName;
                contactBusinessModel.lastName = contactApiModel.lastName;
                contactBusinessModel.homePhone = contactApiModel.homePhone;
                contactBusinessModel.workPhone = contactApiModel.workPhone;
            }
            return contactBusinessModel;
        };
        ContactFactory.prototype.createContactApiModel = function (contactBusinessModel) {
            var contactApiModel = {};
            if (contactBusinessModel) {
                contactApiModel.id = contactBusinessModel.id;
                contactApiModel.contactUpdatedMarker = "A";
            }
            return contactApiModel;
        };
        return ContactFactory;
    }());
    exports.ContactFactory = ContactFactory;
});

//# sourceMappingURL=contactFactory.js.map
