import {ISchemaLoader} from "../../../../app/common/simulation/ISchemaLoader";
import {IAssetService} from "../../../../app/common/core/services/IAssetService";
import {SchemaLoader} from "../../../../app/common/simulation/schemaLoader";

describe("Schema loader", () => {
    let sandbox: Sinon.SinonSandbox;

    let assetService: IAssetService;
    let schemaLoader: ISchemaLoader;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        assetService = <IAssetService>{};

        schemaLoader = new SchemaLoader(<IAssetService>assetService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getSchema", () => {
       let loadJsonStub: Sinon.SinonStub;

       beforeEach(() => {
           loadJsonStub = assetService.loadJson = sandbox
                .stub()
                .returns(Promise.resolve(["name"]))
       });

       it ("should load schemas from asset service on first time load", (done) => {
            schemaLoader.getSchema("some-schema").then((scenario) => {
                expect(loadJsonStub.calledWithExactly("schemas/schemaList.json")).toEqual(true);
                done();
            });
       });

       it ("should load schemas from cache on second invocation", (done) => {
           schemaLoader.getSchema("some-schema").then(() => {
               expect(loadJsonStub.calledWithExactly("schemas/schemaList.json")).toEqual(true);
               expect(loadJsonStub.calledWithExactly("schemas/name")).toEqual(true);

                schemaLoader.getSchema("some-cache").then((scenarioList) => {
                    expect(loadJsonStub.calledTwice).toEqual(true);
                    done();
                });
            });
       });
    });
});
