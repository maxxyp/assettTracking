import {Job as JobBusinessModel} from "../models/job";
import {IComplaintFactory} from "./interfaces/IComplaintFactory";
import {IComplaintReport} from "../../api/models/fft/jobs/jobupdate/IComplaintReport";

export class ComplaintFactory implements IComplaintFactory {
    public createComplaintApiModel(jobBusinessModel: JobBusinessModel): IComplaintReport {

        let isComplaint = jobBusinessModel && JobBusinessModel.hasCharge(jobBusinessModel) && jobBusinessModel.charge && jobBusinessModel.charge.chargeOption === "2";

        if (isComplaint) {
            let complaintApiModel = <IComplaintReport>{};
            complaintApiModel.customerId = jobBusinessModel.customerId;
            complaintApiModel.complaintReasonCode = jobBusinessModel.charge.complaintReasonCodeCharge;
            complaintApiModel.complaintActionCategory = jobBusinessModel.charge.complaintActionCategoryCharge;
            complaintApiModel.compensationAmount = undefined;
            complaintApiModel.complaintRemarks = jobBusinessModel.charge.remarks;
            return complaintApiModel;
        }

        return undefined;
    }
}
