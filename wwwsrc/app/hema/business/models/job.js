define(["require", "exports", "./jobState", "./riskAcknowledgement", "../../core/numberHelper", "../../core/dateHelper", "../../../common/core/guid", "./part"], function (require, exports, jobState_1, riskAcknowledgement_1, numberHelper_1, dateHelper_1, guid_1, part_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Job = /** @class */ (function () {
        function Job() {
            this.state = jobState_1.JobState.idle;
            this.riskAcknowledgement = new riskAcknowledgement_1.RiskAcknowledgement();
            this.uniqueId = guid_1.Guid.newGuid();
        }
        Job.hasCharge = function (job) {
            return job && job.tasks && job.tasks.some(function (task) { return task.isCharge; });
        };
        Job.isActive = function (job) {
            return !!job && job.state !== jobState_1.JobState.idle && job.state !== jobState_1.JobState.done;
        };
        Job.getTasksAndCompletedTasks = function (job) {
            // tasks are stored in their presentation order.  We want completed tasks at the end
            //  so the combined list of tasks emerging from here will be in the desired presentation order.
            //  todo: should ordering be done explicitly at the UI?
            return (job.tasks || []).concat(job.tasksNotToday || []);
        };
        Job.hasHazardAndRisk = function (job) {
            var risks = job.risks || [];
            return {
                hasHazard: risks.some(function (risk) { return risk.isHazard; }),
                hasRisk: risks.some(function (risk) { return !risk.isHazard; })
            };
        };
        Job.isLandlordJob = function (job) {
            return !!(job
                && job.tasks
                && job.tasks.some(function (task) {
                    return task
                        && !task.isNotDoingTask
                        && task.jobType === "AS"
                        && task.applianceType === "INS";
                }));
        };
        Job.fromJson = function (raw) {
            var job = new Job();
            Object.assign(job, raw);
            job.dispatchTime = dateHelper_1.DateHelper.convertDateTime(raw.dispatchTime);
            job.enrouteTime = dateHelper_1.DateHelper.convertDateTime(raw.enrouteTime);
            job.onsiteTime = dateHelper_1.DateHelper.convertDateTime(raw.onsiteTime);
            job.completionTime = dateHelper_1.DateHelper.convertDateTime(raw.completionTime);
            job.pendingTime = dateHelper_1.DateHelper.convertDateTime(raw.pendingTime);
            job.allocationTime = dateHelper_1.DateHelper.convertDateTime(raw.allocationTime);
            job.holdTime = dateHelper_1.DateHelper.convertDateTime(raw.holdTime);
            job.cancellationTime = dateHelper_1.DateHelper.convertDateTime(raw.cancellationTime);
            // todo put in Risks.fromJson(...)
            if (raw.risks) {
                raw.risks.forEach(function (risk) { return risk.date = dateHelper_1.DateHelper.convertDateTime(risk.date); });
                job.risks = raw.risks;
            }
            if (raw.deletedRisks) {
                raw.deletedRisks.forEach(function (risk) { return risk.date = dateHelper_1.DateHelper.convertDateTime(risk.date); });
                job.deletedRisks = raw.deletedRisks;
            }
            // todo put in Visit.fromJson...
            if (raw.visit) {
                var _a = raw.visit, timeSlotFrom = _a.timeSlotFrom, timeSlotTo = _a.timeSlotTo;
                job.visit.timeSlotFrom = dateHelper_1.DateHelper.convertDateTime(timeSlotFrom);
                job.visit.timeSlotTo = dateHelper_1.DateHelper.convertDateTime(timeSlotTo);
            }
            // todo put in Task.fromJson
            if (raw.tasks) {
                raw.tasks.forEach(function (task) {
                    if (task.activities) {
                        task.activities.forEach(function (activity) {
                            activity.date = dateHelper_1.DateHelper.convertDateTime(activity.date);
                            if (activity.parts && activity.parts.length > 0) {
                                activity.parts.forEach(function (part) { return part_1.Part.fromJson(part); });
                            }
                        });
                    }
                });
                job.tasks = raw.tasks;
            }
            if (raw.tasksNotToday) {
                raw.tasksNotToday.forEach(function (task) {
                    if (task.activities) {
                        task.activities.forEach(function (activity) {
                            activity.date = dateHelper_1.DateHelper.convertDateTime(activity.date);
                        });
                    }
                });
                job.tasksNotToday = raw.tasksNotToday;
            }
            // todo put in History.fromJson ...
            if (raw.history) {
                if (raw.history.tasks) {
                    raw.history.tasks.forEach(function (task) {
                        task.activities.forEach(function (activity) {
                            activity.date = dateHelper_1.DateHelper.convertDateTime(activity.date);
                        });
                    });
                }
                if (raw.history.appliances) {
                    raw.history.appliances.forEach(function (appliance) {
                        appliance.contractExpiryDate = dateHelper_1.DateHelper.convertDateTime(appliance.contractExpiryDate);
                        if (appliance.safety && appliance.safety.previousApplianceUnsafeDetail) {
                            appliance.safety.previousApplianceUnsafeDetail.date =
                                dateHelper_1.DateHelper.convertDateTime(appliance.safety.previousApplianceUnsafeDetail.date);
                        }
                    });
                }
                job.history = raw.history;
            }
            // todo put in Appointment.fromJson...
            if (raw.appointment) {
                raw.appointment.promisedDate = dateHelper_1.DateHelper.convertDateTime(raw.appointment.promisedDate);
                job.appointment = raw.appointment;
            }
            // todo put in PartBasket
            if (raw.partsDetail) {
                var _b = raw.partsDetail, partsToday = _b.partsToday, partsBasket = _b.partsBasket;
                if (partsToday && partsToday.parts && partsToday.parts.length > 0) {
                    partsToday.parts.forEach(function (p) { return part_1.Part.fromJson(p); });
                }
                if (partsBasket) {
                    partsBasket.lastPartGatheredTime = dateHelper_1.DateHelper.convertDateTime(partsBasket.lastPartGatheredTime);
                    var partsInBasket = partsBasket.partsInBasket, partsToOrder = partsBasket.partsToOrder, manualPartDetail = partsBasket.manualPartDetail;
                    if (partsInBasket && partsInBasket.length > 0) {
                        partsInBasket.forEach(function (p) { return part_1.Part.fromJson(p); });
                    }
                    if (partsToOrder && partsToOrder.length > 0) {
                        partsToOrder.forEach(function (p) { return part_1.Part.fromJson(p); });
                    }
                    if (manualPartDetail && manualPartDetail.price) {
                        manualPartDetail.price = numberHelper_1.NumberHelper.convertToBigNumber(manualPartDetail.price);
                    }
                }
                job.partsDetail = raw.partsDetail;
            }
            // todo put in chargeableMain
            if (raw.charge) {
                job.charge.discountAmount = numberHelper_1.NumberHelper.convertToBigNumber(raw.charge.discountAmount);
                job.charge.netTotal = numberHelper_1.NumberHelper.convertToBigNumber(raw.charge.netTotal);
                job.charge.chargeTotal = numberHelper_1.NumberHelper.convertToBigNumber(raw.charge.chargeTotal);
                job.charge.totalVatAmount = numberHelper_1.NumberHelper.convertToBigNumber(raw.charge.totalVatAmount);
                if (raw.charge.tasks) {
                    raw.charge.tasks.map(function (chargeableTask) {
                        if (chargeableTask.task) {
                            chargeableTask.task.activities = chargeableTask.task.activities.map(function (activity) {
                                activity.date = dateHelper_1.DateHelper.convertDateTime(activity.date);
                                return activity;
                            });
                            chargeableTask.vat = numberHelper_1.NumberHelper.convertToBigNumber(chargeableTask.vat);
                            chargeableTask.discountAmount = numberHelper_1.NumberHelper.convertToBigNumber(chargeableTask.discountAmount);
                            chargeableTask.fixedPriceQuotationAmount = numberHelper_1.NumberHelper.convertToBigNumber(chargeableTask.fixedPriceQuotationAmount);
                            if (chargeableTask.labourItem) {
                                chargeableTask.labourItem.netAmount = numberHelper_1.NumberHelper.convertToBigNumber(chargeableTask.labourItem.netAmount);
                                chargeableTask.labourItem.vat = numberHelper_1.NumberHelper.convertToBigNumber(chargeableTask.labourItem.vat);
                                if (chargeableTask.labourItem.chargePair) {
                                    var pair = chargeableTask.labourItem.chargePair;
                                    pair.primeCharge = numberHelper_1.NumberHelper.convertToBigNumber(pair.primeCharge);
                                    pair.subsequentCharge = numberHelper_1.NumberHelper.convertToBigNumber(pair.subsequentCharge);
                                }
                            }
                            if (chargeableTask.partItems) {
                                chargeableTask.partItems.forEach(function (partItem) {
                                    partItem.netAmount = numberHelper_1.NumberHelper.convertToBigNumber(partItem.netAmount);
                                    partItem.vat = numberHelper_1.NumberHelper.convertToBigNumber(partItem.vat);
                                });
                            }
                        }
                        return chargeableTask;
                    });
                }
                job.charge = raw.charge;
            }
            return job;
        };
        Job.isIncompleteSerialization = function (job) {
            if (job && job.charge && job.charge.tasks && job.charge.tasks.length > 0) {
                return job.charge.tasks.some(function (task) { return typeof task.calculatedVatAmount === "undefined"; });
            }
            return false;
        };
        return Job;
    }());
    exports.Job = Job;
});

//# sourceMappingURL=job.js.map
