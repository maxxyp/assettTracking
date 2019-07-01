import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../../../business/models/landlord/landlordSafetyCertificate";
import {LandlordSafetyCertificateAppliance as LandlordSafetyCertificateApplianceBusinessModel} from "../../../business/models/landlord/landlordSafetyCertificateAppliance";
import {LandlordSafetyCertificateDefect as LandlordSafetyCertificateDefectBusinessModel} from "../../../business/models/landlord/landlordSafetyCertificateDefect";

import {LandlordSafetyCertificateApplianceViewModel} from "../../models/landlordSafetyCertificateApplianceViewModel";
import {LandlordSafetyCertificateDefectViewModel} from "../../models/landlordSafetyCertificateDefectViewModel";
import {LandlordSafetyCertificateViewModel} from "../../models/landlordSafetyCertificateViewModel";

export interface ILandlordFactory {
    createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel: LandlordSafetyCertificateBusinessModel, labels: { [key: string]: any })
        : LandlordSafetyCertificateViewModel;

    createLandlordSafetyCertificateApplianceViewModel(certificateApplianceBusinessModel: LandlordSafetyCertificateApplianceBusinessModel, labels: { [key: string]: any })
        : LandlordSafetyCertificateApplianceViewModel;

    createLandlordSafetyCertificateDefectViewModel(certificateDefectBusinessModel: LandlordSafetyCertificateDefectBusinessModel, labels: { [key: string]: any })
        : LandlordSafetyCertificateDefectViewModel;
}
