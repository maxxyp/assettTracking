import { BaseViewModel } from "../../../../../app/hema/presentation/models/baseViewModel";
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ViewModelState } from "../../../../../app/hema/presentation/elements/viewModelState";

class BaseTest extends BaseViewModel {}

describe("the base view model", () => {

    let labelService: ILabelService;
    let eventAggregator: EventAggregator;
    let dialogService: DialogService;

    let sandbox: Sinon.SinonSandbox;

    let viewModel: BaseViewModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelService = <ILabelService>{};
        eventAggregator = new EventAggregator();
        dialogService = <DialogService>{};

        viewModel = new BaseTest(labelService, eventAggregator, dialogService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(viewModel).toBeDefined();
    });

    it("should show busy on initialisation", () => {
        viewModel = new BaseTest(labelService, eventAggregator, dialogService);
        expect(viewModel.viewState).toEqual(ViewModelState.busy);
        expect(viewModel.viewStateText).toEqual("Loading, please wait...");
    });

    it ("showBusy should assign `viewState` busy", () => {
        viewModel.showBusy("Any message");
        expect(viewModel.viewState).toEqual(ViewModelState.busy);
        expect(viewModel.viewStateText).toEqual("Any message");
    });

    it ("showContent should assign `viewState` content", () => {
        viewModel.showContent();
        expect(viewModel.viewState).toEqual(ViewModelState.content);
        expect(viewModel.viewStateText).toEqual("");
    });

    describe("attachLabels", () => {
        it("can attach labels", () => {
            viewModel.attachLabels({"foo": "1", "bar": "2"});
            expect(viewModel.labels["foo"]).toBe("1");
            expect(viewModel.labels["bar"]).toBe("2");
        });

        it("can attach labels when labels exist", () => {
            viewModel.labels = {"baz": "3"};
            viewModel.attachLabels({"foo": "1", "bar": "2"});
            expect(viewModel.labels["foo"]).toBe("1");
            expect(viewModel.labels["bar" ]).toBe("2");
            expect(viewModel.labels["baz"]).toBe("3");
        });

        it("can cope with a missing argument", () => {
            try {
                viewModel.attachLabels(undefined);
            } catch (err) {
                fail("should not be here");
            }
        });

        it("should not overwrite the existing labels", () => {            
            viewModel.labels = {"objectName": "Gas Safety"};
            viewModel.attachLabels({"objectName": "Appliance Reading", "test": "test"});
            expect(viewModel.labels["objectName"]).toBe("Gas Safety");
            expect(viewModel.labels["test"]).toBe("test");            
        });
    });

});
