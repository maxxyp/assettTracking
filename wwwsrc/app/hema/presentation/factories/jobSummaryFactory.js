var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./taskFactory", "../models/jobSummaryViewModel", "../../core/customerHelper"], function (require, exports, aurelia_framework_1, taskFactory_1, jobSummaryViewModel_1, customerHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobSummaryFactory = /** @class */ (function () {
        function JobSummaryFactory(taskFactory) {
            this._taskFactory = taskFactory;
        }
        JobSummaryFactory.prototype.createJobSummaryViewModel = function (job) {
            var _this = this;
            var vm = new jobSummaryViewModel_1.JobSummaryViewModel();
            vm.jobNumber = job.id;
            vm.jobState = job.state;
            if (job.visit) {
                vm.specialInstructions = job.visit.specialInstructions;
                vm.engineerInstructions = job.visit.engineerInstructions;
                vm.earliestStartTime = job.visit.timeSlotFrom;
                vm.latestStartTime = job.visit.timeSlotTo;
            }
            if (job.contact) {
                var contactParts = [];
                if (job.contact.title) {
                    contactParts.push(job.contact.title);
                }
                if (job.contact.firstName) {
                    contactParts.push(job.contact.firstName);
                }
                if (job.contact.middleName) {
                    contactParts.push(job.contact.middleName);
                }
                if (job.contact.lastName) {
                    contactParts.push(job.contact.lastName);
                }
                vm.contactName = contactParts.join(" ");
                vm.password = job.contact.password;
                vm.contactTelephoneNumber = job.contact.homePhone;
            }
            if (job.premises) {
                vm.accessInfo = job.premises.accessInfo;
                vm.address = this.removeTrailingCommasFromAddress(job.premises.address);
                vm.premisesId = job.premises.id;
                var parts = [];
                var lines = customerHelper_1.CustomerHelper.getAddressLines(vm.address);
                if (lines && lines.length > 0) {
                    parts.push(lines[0]);
                }
                if (vm.address.postCode) {
                    parts.push(vm.address.postCode);
                }
                vm.shortAddress = parts.join(", ");
            }
            if (job.tasks) {
                job.tasks.forEach(function (task) {
                    if (task) {
                        vm.tasks.push(_this._taskFactory.createTaskSummaryViewModel(task));
                    }
                });
            }
            vm.isLandlordJob = job.isLandlordJob;
            return vm;
        };
        JobSummaryFactory.prototype.removeTrailingCommasFromAddress = function (address) {
            var _this = this;
            address.premisesName = this.removeTrailingCommas(address.premisesName);
            if (!address.line || address.line.length === 0) {
                return address;
            }
            address.line = address.line.map(function (line) { return _this.removeTrailingCommas(line); });
            return address;
        };
        JobSummaryFactory.prototype.removeTrailingCommas = function (str) {
            if (str) {
                var fmtLine = str.trim();
                if (fmtLine && fmtLine.charAt(str.length - 1) === ",") {
                    fmtLine = fmtLine.substr(0, str.length - 1);
                }
                return fmtLine;
            }
            return str;
        };
        JobSummaryFactory = __decorate([
            aurelia_framework_1.inject(taskFactory_1.TaskFactory),
            __metadata("design:paramtypes", [Object])
        ], JobSummaryFactory);
        return JobSummaryFactory;
    }());
    exports.JobSummaryFactory = JobSummaryFactory;
});

//# sourceMappingURL=jobSummaryFactory.js.map
