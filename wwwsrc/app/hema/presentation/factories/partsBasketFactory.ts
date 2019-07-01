import {PartsBasket as PartsBasketBusinessModel} from "../../business/models/partsBasket";
import {PartsBasketViewModel} from "../models/partsBasketViewModel";
import {IPartsBasketFactory} from "./interfaces/IPartsBasketFactory";

export class PartsBasketFactory implements IPartsBasketFactory {

    public createPartsBasketViewModel(partsBasketBusinessModel: PartsBasketBusinessModel): PartsBasketViewModel {

        let vm = new PartsBasketViewModel();

        if (partsBasketBusinessModel) {

            vm.lastPartGatheredTime = partsBasketBusinessModel.lastPartGatheredTime;
            vm.deliverPartsToSite = partsBasketBusinessModel.deliverPartsToSite;
            vm.manualPartDetail = Object.assign({}, partsBasketBusinessModel.manualPartDetail);

            vm.dataState = partsBasketBusinessModel.dataState;
            vm.dataStateId = partsBasketBusinessModel.dataStateId;

            partsBasketBusinessModel.partsInBasket.forEach(part => {
                let partAdd = Object.assign({}, part);
                vm.partsInBasket.push(partAdd);
            });

            partsBasketBusinessModel.partsToOrder.forEach(part => {
                let partAdd = Object.assign({}, part);
                vm.partsToOrder.push(partAdd);
            });

            vm.showAddPartManually = partsBasketBusinessModel.showAddPartManually;
            vm.showRemainingAddPartManuallyFields = partsBasketBusinessModel.showRemainingAddPartManuallyFields;
            // vm.partsRequired = partsBasketBusinessModel.partsRequired;
            vm.hasAtLeastOneWrongActivityStatus = partsBasketBusinessModel.hasAtLeastOneWrongActivityStatus;
            // vm.taskStatus = partsBasketBusinessModel.taskStatus;
            vm.partsListValidation = "somevalue";
            // vm.partsInBasketRequired = false;
        }

        return vm;
    }
}
