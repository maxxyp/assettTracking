import {IContactFactory} from "./interfaces/IContactFactory";

import {IContact as ContactApiModel} from "../../api/models/fft/jobs/IContact";
import {Contact as ContactBusinessModel} from "../models/contact";
import {IContact as ContactUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IContact";

export class ContactFactory implements IContactFactory {
    public createContactBusinessModel(contactApiModel: ContactApiModel): ContactBusinessModel {
        let contactBusinessModel: ContactBusinessModel = new ContactBusinessModel();

        if (contactApiModel) {
            contactBusinessModel.id = contactApiModel.id;
            contactBusinessModel.password = contactApiModel.password;
            contactBusinessModel.title = contactApiModel.title;
            contactBusinessModel.firstName = contactApiModel.firstName;
            contactBusinessModel.middleName = contactApiModel.middleName;
            contactBusinessModel.lastName = contactApiModel.lastName;
            contactBusinessModel.homePhone = contactApiModel.homePhone;
            contactBusinessModel.workPhone = contactApiModel.workPhone;
        }

        return contactBusinessModel;
    }

    public createContactApiModel(contactBusinessModel: ContactBusinessModel): ContactUpdateApiModel {
        let contactApiModel: ContactUpdateApiModel = <ContactUpdateApiModel>{};

        if (contactBusinessModel) {
            contactApiModel.id = contactBusinessModel.id;
            contactApiModel.contactUpdatedMarker = "A";
        }

        return contactApiModel;
    }
}
