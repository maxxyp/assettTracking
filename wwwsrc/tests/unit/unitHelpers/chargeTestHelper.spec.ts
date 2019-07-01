import { Task } from "../../../app/hema/business/models/task";
import { Activity } from "../../../app/hema/business/models/activity";
import { IChargeType } from "../../../app/hema/business/models/reference/IChargeType";
import { IAreaChargeRules } from "../../../app/hema/business/models/reference/IAreaChargeRules";
import { IJcChargeRules } from "../../../app/hema/business/models/reference/IJcChargeRules";
import { ILabourChargeRule } from "../../../app/hema/business/models/reference/ILabourChargeRule";
import { IPrimeChargeInterval } from "../../../app/hema/business/models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../../app/hema/business/models/reference/ISubsqntChargeInterval";
import * as moment from "moment";

export class Helper {

    public static createTask(id: string, chargeType: string, jobType: string, applianceType: string, startTime: string
        , endTime: string, chargeDuration: number): Task {
        let task = new Task(true, false);
        task.id = id;
        task.chargeType = chargeType;
        task.jobType = jobType;
        task.applianceType = applianceType;
        task.startTime = startTime;
        task.endTime = endTime;
        task.chargeableTime = chargeDuration;
        task.activities = [];
        task.status = "D";

        return task;
    }

    public static createTaskActivity(date: string, status: string, chargeableTime: number): Activity {
        let activity = new Activity();
        activity.date = moment(date, "DD-MM-YYYY HH:mm").toDate();
        activity.status = status;
        activity.chargeableTime = chargeableTime;

        return activity;
    }

    public static createChargeType(code: string, description: string, vatCode: string, chargeLabourIndicator: string
        , chargePartsIndicator: string): IChargeType {

        let chargeType = <IChargeType>{};
        chargeType.chargeType = code;
        chargeType.chargeTypeDescription = description;
        chargeType.vatCode = vatCode;
        chargeType.chargeLabourIndicator = chargeLabourIndicator;
        chargeType.chargePartsIndicator = chargePartsIndicator;

        return chargeType;
    }

    public static createJcChargeRule(code: string, jobTypeCode: string, applianceTypeCode: string,
                                     chargeMethodType: string, applianceContractTypeCode: string, chargeStartEndDate: string
        , chargeEndDate: string, labourChargeRuleCode: string, primeJobIndicator: string, primeCharge: number = null
        , subsquentCharge: number = null, seqNo = 0): IJcChargeRules {

        let item = <IJcChargeRules>{};

        item.chargeRuleSequence = seqNo;
        item.jobType = jobTypeCode;
        item.applianceType = applianceTypeCode;
        item.chargeType = chargeMethodType;
        item.contractType = applianceContractTypeCode;
        item.effectiveDate = chargeStartEndDate;
        item.expirationDate = chargeEndDate;
        item.labourChargeRuleCode = labourChargeRuleCode;
        item.primeJobProcessIndicator = primeJobIndicator;
        item.standardLabourChargePrime = primeCharge;
        item.standardLabourChargeSubs = subsquentCharge;

        return item;
    }

    public static createAreaChargeRule(actionType: string, objType: string, appConType: string, effectiveDate: string,
                                       expirationDate: string, companyCode: string, chgRuleSeqNo: number) {

        let areaChargeRule = <IAreaChargeRules>{};
        areaChargeRule.jobType = actionType;
        areaChargeRule.applianceType = objType;
        areaChargeRule.contractType = appConType;
        areaChargeRule.effectiveDate = effectiveDate;
        areaChargeRule.expirationDate = expirationDate;
        areaChargeRule.companyCode = companyCode;
        areaChargeRule.chargeRuleSequence = chgRuleSeqNo;

        return areaChargeRule;
    }

    public static createLabourChargeRuleCode(code: string, minChargeIfPrime: number, minPeriodIfPrime: number
        , minChargeIfSub: number, minPeriodIfSub: number): ILabourChargeRule {

        let labourChargeRuleCode = <ILabourChargeRule>{};

        labourChargeRuleCode.labourChargeRuleCode = code;
        labourChargeRuleCode.minimumChargeIfPrime = minChargeIfPrime;
        labourChargeRuleCode.minimumPdIfPrime = minPeriodIfPrime;
        labourChargeRuleCode.minimumChargeIfSbsqt = minChargeIfSub;
        labourChargeRuleCode.minimumPdIfSbsqt = minPeriodIfSub;

        return labourChargeRuleCode;
    }

    public static createPrimeChargeInterval(code: string, labourChargeRuleCode: string, sequence: number, interval: number
        , period: number, price: number) {

        let pci = <IPrimeChargeInterval>{};

        pci.labourChargeRuleCode = labourChargeRuleCode;
        pci.primeChargeIntervalSequence = sequence;
        pci.primeChargeInterval = interval;
        pci.primeChargeIntervalPD = period;
        pci.primeChargeIntervalPRC = price;

        return pci
    }

    public static createSubsqntChargeInterval(code: string, labourChargeRuleCode: string, sequence: number, interval: number
        , period: number, price: number) {

        let sci = <ISubsqntChargeInterval>{};

        sci.labourChargeRuleCode = labourChargeRuleCode;
        sci.subsequentChargeIntervalSequence = sequence;
        sci.subsequentChargeInterval = interval;
        sci.subsequentChargeIntervalPd = period;
        sci.subsequentChargeIntervalPrc = price;

        return sci
    }
}
