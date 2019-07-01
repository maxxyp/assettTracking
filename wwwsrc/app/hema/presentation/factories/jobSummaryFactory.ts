import {inject} from "aurelia-framework";

import {IJobSummaryFactory} from "./interfaces/IJobSummaryFactory";
import {ITaskFactory} from "./interfaces/ITaskFactory";
import {TaskFactory} from "./taskFactory";

import {Job} from "../../business/models/job";
import {JobSummaryViewModel} from "../models/jobSummaryViewModel";
import {CustomerHelper} from "../../core/customerHelper";
import {Address} from "../../business/models/address";

@inject(TaskFactory)
export class JobSummaryFactory implements IJobSummaryFactory {

    private _taskFactory: ITaskFactory;

    constructor(taskFactory: ITaskFactory) {
        this._taskFactory = taskFactory;
    }

    public createJobSummaryViewModel(job: Job): JobSummaryViewModel {
        let vm: JobSummaryViewModel = new JobSummaryViewModel();
        vm.jobNumber = job.id;
        vm.jobState = job.state;
        if (job.visit) {
            vm.specialInstructions = job.visit.specialInstructions;
            vm.engineerInstructions = job.visit.engineerInstructions;
            vm.earliestStartTime = job.visit.timeSlotFrom;
            vm.latestStartTime = job.visit.timeSlotTo;
        }

        if (job.contact) {
            let contactParts: string[] = [];

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

            let parts: string[] = [];
            let lines = CustomerHelper.getAddressLines(vm.address);
            if (lines && lines.length > 0) {
                parts.push(lines[0]);
            }
            if (vm.address.postCode) {
                parts.push(vm.address.postCode);
            }

            vm.shortAddress = parts.join(", ");
        }

        if (job.tasks) {
            job.tasks.forEach(task => {
                if (task) {
                    vm.tasks.push(this._taskFactory.createTaskSummaryViewModel(task));
                }
            });
        }

        vm.isLandlordJob = job.isLandlordJob;

        return vm;
    }

    private removeTrailingCommasFromAddress(address: Address) : Address {
        address.premisesName = this.removeTrailingCommas(address.premisesName);

        if (!address.line || address.line.length === 0) {
            return address;
        }

        address.line = address.line.map(line => this.removeTrailingCommas(line));
        return address;
    }

    private removeTrailingCommas(str: string): string {

        if (str) {
            let fmtLine = str.trim();
            if (fmtLine && fmtLine.charAt(str.length - 1) === ",") {
                fmtLine = fmtLine.substr(0, str.length - 1);
            }
            return fmtLine;
        }
        return str;
    }
}
