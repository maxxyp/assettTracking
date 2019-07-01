export interface IJcChargeRules {
   jobType: string;
   applianceType: string;
   contractType: string;
   effectiveDate: string; // date
   expirationDate: string; // date
   chargeRuleSequence: number;
   chargeType: string;
   chargeLevel: number;
   partsFreeAmountValue: number;
   primeJobProcessIndicator: string;
   standardLabourChargePrime: number;
   standardLabourChargeSubs: number;
   standardPartsChargePrime: number;
   standardPartsChargeSubs: number;
   labourChargeRuleCode: string;
}
