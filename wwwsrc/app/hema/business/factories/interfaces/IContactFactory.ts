import {IContact as ContactApiModel} from "../../../api/models/fft/jobs/IContact";
import {Contact as ContactBusinessModel} from "../../models/contact";
import {IContact as ContactUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IContact";

export interface IContactFactory {
    createContactBusinessModel(contactApiModel: ContactApiModel): ContactBusinessModel;
    createContactApiModel(contactBusinessModel: ContactBusinessModel): ContactUpdateApiModel;
}
