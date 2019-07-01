import {CatalogLookup} from "../../../../../app/hema/presentation/elements/catalogLookup";
import {ICatalogService} from "../../../../../app/hema/business/services/interfaces/ICatalogService";

describe("the CatalogLookup module", () => {
    let catalogLookup: CatalogLookup;
    let sandbox: Sinon.SinonSandbox;
    let catalogServiceStub: ICatalogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        catalogServiceStub = <ICatalogService>{};
        catalogLookup = new CatalogLookup(catalogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(catalogLookup).toBeDefined();
    });
});
