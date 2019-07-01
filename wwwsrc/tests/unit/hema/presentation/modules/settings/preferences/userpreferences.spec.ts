/// <reference path="../../../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IStorageService } from "../../../../../../../app/hema/business/services/interfaces/IStorageService";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IValidationService } from "../../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IVanStockService } from "../../../../../../../app/hema/business/services/interfaces/IVanStockService";
import {ICatalogService} from "../../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {UserPreferences} from "../../../../../../../app/hema/presentation/modules/settings/preferences/userPreferences";
import {IJobService} from "../../../../../../../app/hema/business/services/interfaces/IJobService";
import {TaskQueue} from "aurelia-task-queue";
import {Container} from "aurelia-dependency-injection";
import { ChargeServiceConstants } from "../../../../../../../app/hema/business/services/constants/chargeServiceConstants";
import { UserPreferenceConstants } from "../../../../../../../app/hema/business/services/constants/userPreferenceConstants";

describe("the UserPreferences module", () => {
    let taskQueue: TaskQueue = Container.instance.get(TaskQueue);

    let flushChangeHandler = () => new Promise(resolve => taskQueue.queueMicroTask(() => resolve()));

    let sandbox: Sinon.SinonSandbox;
    let userPreferences: UserPreferences;
    let labelServiceStub = <ILabelService>{};
    let dialogServiceStub = <DialogService>{};
    let validationServiceStub = <IValidationService>{};
    let vanStockServiceStub = <IVanStockService>{};
    let storageServiceStub = <IStorageService>{};
    let catalogServiceStub = <ICatalogService>{};
    let jobServiceStub = <IJobService> {};
    let eaStub = <EventAggregator>{};

    let sectors = [
        { sectorCode: "PatchGas", sectorDescription: "Gas Services" },
        { sectorCode: "PacthES", sectorDescription: "Electrical Services" }
    ];

    let regions = [
        {
            "key": "2",
            "id": "2",
            "description": "Central & Northwest",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "7",
            "id": "7",
            "description": "London",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "3",
            "id": "3",
            "description": "Northeast",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "4",
            "id": "4",
            "description": "Wales & the West",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "1",
            "id": "1",
            "description": "Scotland",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "6",
            "id": "6",
            "description": "Wales & the West",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "5",
            "id": "5",
            "description": "East & Southeast",
            "ctlgEntDelnMkr": "N"
        },
        {
            "key": "20",
            "id": "20",
            "description": "Foo",
            "ctlgEntDelnMkr": "N"
        }
    ];

    let patchCodes = [
        {patchCode: "22B1"},
        {patchCode: "11A1"},
        {patchCode: "11A2"},
        {patchCode: "D123"},
        {patchCode: "74L2"}
    ];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        vanStockServiceStub.getSectors = sandbox.stub().returns(sectors);
        catalogServiceStub.getRegions = sandbox.stub().resolves(regions);

        storageServiceStub.getWorkingSector = sandbox.stub().resolves(undefined);
        storageServiceStub.getUserPatch = sandbox.stub().resolves(undefined);
        storageServiceStub.getUserRegion = sandbox.stub().resolves(undefined);

        storageServiceStub.setWorkingSector = sandbox.stub().resolves(undefined);
        storageServiceStub.setUserPatch = sandbox.stub().resolves(undefined);
        storageServiceStub.setUserRegion = sandbox.stub().resolves(undefined);

        vanStockServiceStub.getPatchCodes = sandbox.stub().resolves(patchCodes);

        validationServiceStub.build = sandbox.stub().resolves(undefined);

        jobServiceStub.getActiveJobId = sandbox.stub().resolves("1234");

        eaStub.publish = sandbox.stub();

        userPreferences = new UserPreferences(labelServiceStub, eaStub, dialogServiceStub, validationServiceStub, vanStockServiceStub, storageServiceStub,
            catalogServiceStub, jobServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(userPreferences).toBeDefined();
    });

    describe("attached", () => {
        it("when first loads, can attach and build catalogs, hits storage and set up validation and sets isLoaded so view knows when to attach", async done => {
            let validationSpy = sandbox.spy(userPreferences, "buildValidation");

            await userPreferences.attachedAsync();
            expect(userPreferences.workingSectors).toBe(sectors);

            expect((storageServiceStub.getWorkingSector as Sinon.SinonStub).called).toBe(true);
            expect((storageServiceStub.getUserPatch as Sinon.SinonStub).called).toBe(true);
            expect((storageServiceStub.getUserRegion as Sinon.SinonStub).called).toBe(true);

            expect((userPreferences.patchList).length).toBe(0);

            expect(validationSpy.called).toBe(true);
            expect(userPreferences.isLoaded).toBe(true);
            done();
        });

        it("when loads with data that includes working sector, populates patch list and set isLoaded", async done => {
            storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchES");
            storageServiceStub.getUserPatch = sandbox.stub().resolves("74L2");
            storageServiceStub.getUserRegion = sandbox.stub().resolves("1");
            await userPreferences.attachedAsync();
            expect((vanStockServiceStub.getPatchCodes as Sinon.SinonStub).args[0][0]).toBe("PatchES");
            expect(userPreferences.selectedWorkingSector).toBe("PatchES");
            expect(userPreferences.selectedPatch).toBe("74L2");
            expect(userPreferences.selectedRegion).toBe("1");
            expect((userPreferences.patchList).length).toBe(5);
            done();
        });
    });

    describe("change handlers", () => {
        it("selectedWorkingSectorChanged clears patch if the previously set patch does not appear in the new list", async done => {
            storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchES");
            storageServiceStub.getUserPatch = sandbox.stub().resolves("74L2");
            storageServiceStub.getUserRegion = sandbox.stub().resolves("1");
            await userPreferences.attachedAsync();

            expect(userPreferences.selectedPatch).toBe("74L2");

            vanStockServiceStub.getPatchCodes = sandbox.stub().resolves(["1234"]);

            userPreferences.selectedWorkingSector = "PacthGas"
            await flushChangeHandler();
            expect(userPreferences.selectedPatch).toBeUndefined();
            done();

        });

        it("will only save if all values have been set", async done => {

            let assertStorageCall = (x: number) => {
                expect((storageServiceStub.setUserPatch as Sinon.SinonStub).callCount).toBe(x);
                expect((storageServiceStub.setUserRegion as Sinon.SinonStub).callCount).toBe(x);
                expect((storageServiceStub.setWorkingSector as Sinon.SinonStub).callCount).toBe(x);
            }

            let clear = () => {
                (storageServiceStub.setUserPatch as Sinon.SinonStub).reset();
                (storageServiceStub.setUserRegion as Sinon.SinonStub).reset();
                (storageServiceStub.setWorkingSector as Sinon.SinonStub).reset();
            }

            userPreferences.selectedPatch = "22B1";
            await flushChangeHandler();
            assertStorageCall(0);

            userPreferences.selectedRegion = "2";
            await flushChangeHandler();
            assertStorageCall(0);

            userPreferences.selectedWorkingSector = "3";
            await flushChangeHandler();
            assertStorageCall(1);

            clear();

            userPreferences.selectedPatch = undefined;
            await flushChangeHandler();
            assertStorageCall(0);

            userPreferences.selectedPatch = "22B1";
            await flushChangeHandler();
            assertStorageCall(1);

            clear();

            userPreferences.selectedRegion = undefined;
            await flushChangeHandler();
            assertStorageCall(0);

            userPreferences.selectedRegion = "2";
            await flushChangeHandler();
            assertStorageCall(1);

            done();
        });

    })

    describe("detachedAsync", () => {
        it("sets the data to storage and fires events", async done => {
            userPreferences.selectedPatch = "1";
            userPreferences.selectedRegion = "2";
            userPreferences.selectedWorkingSector = "3";

            await userPreferences.detachedAsync();

            expect((storageServiceStub.setUserPatch as Sinon.SinonStub).args[0][0]).toBe("1");
            expect((storageServiceStub.setUserRegion as Sinon.SinonStub).args[0][0]).toBe("2");
            expect((storageServiceStub.setWorkingSector as Sinon.SinonStub).args[0][0]).toBe("3");

            expect((eaStub.publish as Sinon.SinonStub).calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1234")).toBe(true);
            expect((eaStub.publish as Sinon.SinonStub).calledWith(UserPreferenceConstants.USER_PREFERENCES_CHANGED, {
                engineerType: userPreferences.selectedWorkingSector,
                engineerPatch: userPreferences.selectedPatch,
                engineerRegion: userPreferences.selectedRegion
            })).toBe(true);
            done();
            });
        });

    describe("sorting regions and patch dropdowns", () => {
        it("can alphanumerically sort dropdowns", async done => {
            storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchES");
            await userPreferences.attachedAsync();

            expect(userPreferences.regionList.map(i => i.key)).toEqual(["1", "2", "3", "4", "5", "6", "7", "20"]);
            expect(userPreferences.patchList.map(i => i.patchCode)).toEqual(["11A1", "11A2", "22B1", "74L2", "D123"]);

            done();
        });
    });
});
