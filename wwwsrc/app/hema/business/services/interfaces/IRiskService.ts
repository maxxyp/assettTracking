import {Risk as RiskBusinessModel} from "../../models/risk";

export interface IRiskService {
    getRisks(jobId: string): Promise<RiskBusinessModel[]>;
    getRisk(jobId: string, riskId: string): Promise<RiskBusinessModel>;
    addRisk(jobId: string, risk: RiskBusinessModel): Promise<string>;
    updateRisk(jobId: string, risk: RiskBusinessModel): Promise<void>;
    deleteRisk(jobId: string, riskId: string): Promise<void>;
}
