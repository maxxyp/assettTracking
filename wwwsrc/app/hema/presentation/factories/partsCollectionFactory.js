define(["require", "exports", "../models/partCollectionDetailViewModel", "../models/partsCollectionViewModel", "../models/partsCollectionCustomerViewModel"], function (require, exports, partCollectionDetailViewModel_1, partsCollectionViewModel_1, partsCollectionCustomerViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsCollectionFactory = /** @class */ (function () {
        function PartsCollectionFactory() {
        }
        PartsCollectionFactory.prototype.createPartsCollectionViewModel = function (businessModel) {
            if (businessModel) {
                var viewModel_1 = [];
                businessModel.forEach(function (bm) {
                    var vm = new partCollectionDetailViewModel_1.PartCollectionDetailViewModel();
                    vm.jobId = bm.id;
                    if (bm.parts) {
                        vm.parts = [];
                        bm.parts.forEach(function (x) {
                            var part = new partsCollectionViewModel_1.PartsCollectionViewModel();
                            part.stockReferenceId = x.stockReferenceId;
                            part.quantity = x.quantity;
                            part.description = x.description;
                            vm.parts.push(part);
                        });
                    }
                    if (bm.customer) {
                        vm.customer = new partsCollectionCustomerViewModel_1.PartsCollectionCustomerViewModel();
                        var contactParts = [];
                        if (bm.customer.title) {
                            contactParts.push(bm.customer.title);
                        }
                        if (bm.customer.firstName) {
                            contactParts.push(bm.customer.firstName);
                        }
                        if (bm.customer.middleName) {
                            contactParts.push(bm.customer.middleName);
                        }
                        if (bm.customer.lastName) {
                            contactParts.push(bm.customer.lastName);
                        }
                        vm.customer.contactName = contactParts.join(" ");
                        if (bm.customer.address) {
                            vm.customer.shortAddress = bm.customer.address.join(", ");
                        }
                    }
                    viewModel_1.push(vm);
                });
                return viewModel_1;
            }
            return [];
        };
        return PartsCollectionFactory;
    }());
    exports.PartsCollectionFactory = PartsCollectionFactory;
});

//# sourceMappingURL=partsCollectionFactory.js.map
