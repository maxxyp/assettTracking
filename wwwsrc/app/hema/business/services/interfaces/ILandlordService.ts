import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../../models/landlord/landlordSafetyCertificate";

export interface ILandlordService {
    getLandlordSafetyCertificate(jobId: string): Promise<LandlordSafetyCertificateBusinessModel>;
}
