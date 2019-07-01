define(["require", "exports", "../models/job"], function (require, exports, job_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ComplaintFactory = /** @class */ (function () {
        function ComplaintFactory() {
        }
        ComplaintFactory.prototype.createComplaintApiModel = function (jobBusinessModel) {
            var isComplaint = jobBusinessModel && job_1.Job.hasCharge(jobBusinessModel) && jobBusinessModel.charge && jobBusinessModel.charge.chargeOption === "2";
            if (isComplaint) {
                var complaintApiModel = {};
                complaintApiModel.customerId = jobBusinessModel.customerId;
                complaintApiModel.complaintReasonCode = jobBusinessModel.charge.complaintReasonCodeCharge;
                complaintApiModel.complaintActionCategory = jobBusinessModel.charge.complaintActionCategoryCharge;
                complaintApiModel.compensationAmount = undefined;
                complaintApiModel.complaintRemarks = jobBusinessModel.charge.remarks;
                return complaintApiModel;
            }
            return undefined;
        };
        return ComplaintFactory;
    }());
    exports.ComplaintFactory = ComplaintFactory;
});

//# sourceMappingURL=complaintFactory.js.map
