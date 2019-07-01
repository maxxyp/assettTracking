import { TodaysPartViewModel } from "../../../../../../../app/hema/presentation/modules/parts/viewModels/todaysPartViewModel";
import { PartWarrantyReturn } from "../../../../../../../app/hema/business/models/partWarrantyReturn";
import { Part } from "../../../../../../../app/hema/business/models/part";

describe("the TodaysPartsViewModel ", () => {
    let todaysPartViewModel: TodaysPartViewModel;

    beforeEach(() => {
        todaysPartViewModel = new TodaysPartViewModel();
        todaysPartViewModel.part = new Part();
        todaysPartViewModel.warrantyReturn = new PartWarrantyReturn();       
    });

    it("should be defined", () => {
        expect(todaysPartViewModel).toBeDefined();
    });

    describe("can raise not used", () => {

        it ("should be true when the part order warranty return is falsey", () => {
            todaysPartViewModel.warrantyReturn = undefined;
            expect(todaysPartViewModel.canRaiseNotUsed).toEqual(true);
        });

        it ("should be true when the part order is not warranty return", () => {
            todaysPartViewModel.warrantyReturn.isWarrantyReturn = false;
            expect(todaysPartViewModel.canRaiseNotUsed).toEqual(true);
        });

        it ("should be true when the part order warranty quantity is less than the total parts quantity", () => {
            todaysPartViewModel.warrantyReturn.isWarrantyReturn = true;
            todaysPartViewModel.warrantyReturn.quantityToClaimOrReturn = 1;
            todaysPartViewModel.part.quantity = 2;
            expect(todaysPartViewModel.canRaiseNotUsed).toEqual(true);
        });

        it ("should be false when the part order warranty quantity equal than the total parts quantity", () => {
            todaysPartViewModel.warrantyReturn.isWarrantyReturn = true;
            todaysPartViewModel.warrantyReturn.quantityToClaimOrReturn = 1;
            todaysPartViewModel.part.quantity = 1;
            expect(todaysPartViewModel.canRaiseNotUsed).toEqual(false);
        });

        it ("should be false when the part order warranty quantity greater than the total parts quantity", () => {
            todaysPartViewModel.warrantyReturn.isWarrantyReturn = true;
            todaysPartViewModel.warrantyReturn.quantityToClaimOrReturn = 2;
            todaysPartViewModel.part.quantity = 1;
            expect(todaysPartViewModel.canRaiseNotUsed).toEqual(false);
        });

    });
});
