/// <reference path="../../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";

import { DialogService } from "aurelia-dialog";
import { AppointmentBookingMain } from "../../../../../../app/hema/presentation/modules/appointment/appointmentBookingMain";
import { ViewModelState } from "../../../../../../app/hema/presentation/elements/viewModelState";
import {IJobSummaryFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IJobSummaryFactory";

describe("the AppointmentBookingMain module", () => {
    let appointmentBookingMain: AppointmentBookingMain;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;

    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let jobServiceStub: IJobService;
    let jobSummaryFactoryStub: IJobSummaryFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));
        dialogServiceStub = <DialogService>{};
        jobSummaryFactoryStub = <IJobSummaryFactory>{};
        jobSummaryFactoryStub.createJobSummaryViewModel = sandbox.stub().returns({});

        appointmentBookingMain = new AppointmentBookingMain(labelServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub, jobSummaryFactoryStub);
        afterEach(() => {
            sandbox.restore();
        });

        it("can be created", () => {
            expect(appointmentBookingMain).toBeDefined();
        });

        it(("can configureRouter"), () => {
            appointmentBookingMain.configureRouter(null, null);
            expect(appointmentBookingMain.childRoutes.length === 2).toBeTruthy();
        });

        it(("can activate"), (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);
            appointmentBookingMain.activateAsync({ jobId: "12323", addressId: "ddfsdf" }).then(() => {
                expect(appointmentBookingMain.viewState === ViewModelState.content).toBeTruthy();
            });
        });
    });
});
