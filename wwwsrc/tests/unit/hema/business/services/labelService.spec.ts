/// <reference path="../../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import {LabelService} from "../../../../../app/hema/business/services/labelService";
import {BusinessException} from "../../../../../app/hema/business/models/businessException";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {ICatalogService} from "../../../../../app/hema/business/services/interfaces/ICatalogService";

describe("the LabelService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let labelService: LabelService;

    let catalogServiceService: ICatalogService;
    let configurationService: IConfigurationService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        catalogServiceService = <ICatalogService>{};
        configurationService = <IConfigurationService>{};

        configurationService.getConfiguration = sandbox.stub().returns(null);

        labelService = new LabelService(catalogServiceService, configurationService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(labelService).toBeDefined();
    });

    describe("getGroup", () => {
        let catalogServiceStub: Sinon.SinonStub;

        beforeEach(() => {
            catalogServiceStub = catalogServiceService.getLabels = sandbox.stub();
            catalogServiceStub.withArgs("test").resolves([
                    { id: "label1", label: "Test 1"}
                ]);

            catalogServiceStub.withArgs("common").resolves([
                    { id: "label1", label: "Common 1"},
                    { id: "label2", label: "Common 2"}
                ]);


            configurationService.getConfiguration = sandbox.stub().returns({});
            labelService = new LabelService(catalogServiceService, configurationService);
        });

        it ("should default to namespaced key", (done) => {
            labelService.getGroup("test")
                .then(group => {
                    expect(group["label1"]).toBe("Test 1");
                })
                .then(() => done());

        });

        it ("should fallback to common key", (done) => {
            labelService.getGroup("test")
                .then(group => {
                    expect(group["label2"]).toBe("Common 2");
                })
                .then(() => done());
        });

        it ("should cache common keys", (done) => {

            labelService.getGroup("test")
                .then(group => {
                    expect(catalogServiceStub.args[0][0]).toEqual("common");
                    expect(catalogServiceStub.args[1][0]).toEqual("test");
                    expect(group["label1"]).toBe("Test 1");
                })
                .then(() => labelService.getGroup("test"))
                .then(() => {
                    expect(catalogServiceStub.args[2][0]).toEqual("test");
                })
                .then(() => done());
        });

        it ("should throw when group does not exist", (done) => {
            catalogServiceStub.withArgs("test").rejects("mockerror");

            labelService = new LabelService(catalogServiceService, configurationService);

            labelService.getGroup("test")
                .catch((err: BusinessException) => {
                    expect(err instanceof BusinessException).toBeTruthy();
                    expect(err.reference).toEqual("getGroup");
                    expect(err.message).toEqual("Getting group for key '{0}'");
                    expect(err.parameters[0]).toEqual("test");
                    done();
                });
        });

        it ("should log when group does not exist", (done) => {
            catalogServiceStub.withArgs("test").rejects("mockerror");
            labelService = new LabelService(catalogServiceService, configurationService);

            let errorSpy = spyOn(Logging.getLogger("LabelService"), "error");
            labelService.getGroup("test")
                .catch((err: BusinessException) => {
                    expect(errorSpy.calls.count()).toBe(1);
                    done();
                });
        });

        it("should be able to get a group without common labels", done => {
            labelService.getGroupWithoutCommon("test")
                .then(group => {
                    expect(group["label1"]).toBe("Test 1");
                    expect(group["label2"]).toBeUndefined();
                    done();
                });
        });
    });
});
