/// <reference path="../../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { VanStock } from '../../../../../../app/hema/presentation/modules/vanStock/vanStock';
import { IVanStockService } from "../../../../../../app/hema/business/services/interfaces/IVanStockService";
import { MaterialWithQuantities } from "../../../../../../app/hema/business/models/materialWithQuantities";

describe("the VanStock module", () => {
    let vanStock: VanStock;
    let sandbox: Sinon.SinonSandbox;
    let labelServiceStub: ILabelService;
    let eventAggregator: EventAggregator;
    let dialogServiceStub: DialogService;
    let vanStockServiceStub: IVanStockService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService>{};
        eventAggregator = new EventAggregator();
        dialogServiceStub = <DialogService>{};
        vanStockServiceStub = <IVanStockService>{};

        vanStock = new VanStock(labelServiceStub, eventAggregator, dialogServiceStub, vanStockServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(vanStock).toBeDefined();
    });

    describe("activateAsync", () => {
        beforeEach(() => {
            let material: MaterialWithQuantities[] = [];
            vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(material);
            vanStockServiceStub.getLocalVanStockLineTotal = sandbox.stub().resolves(0);
            vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
            sandbox.restore();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should have empty materials", (done) => {
            vanStock.activateAsync().then(() => {
                expect(vanStock.material.length).toBe(0);
                done();
            })
        });

        it("should hide load more button", (done) => {
            vanStock.activateAsync().then(() => {
                expect(vanStock.hideLoadMore).toBe(true);
                done();
            })
        });
    });

    describe("loadMore", () => {
        describe("loads empty result", () => {
            beforeEach(() => {
                let materials: MaterialWithQuantities[] = [];
                vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(materials);
                vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
                vanStockServiceStub.getLocalVanStockLineTotal = sandbox.stub().resolves(0);
                sandbox.restore();
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should have empty materials", (done) => {
                vanStock.loadMore().then(() => {
                    expect(vanStock.material.length).toBe(0);
                    done();
                })
            });

        });

        describe("loads 5 result", () => {
            beforeEach(() => {
                let materials: MaterialWithQuantities[] = [];
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(materials);
                vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
                vanStockServiceStub.getLocalVanStockLineTotal = sandbox.stub().resolves(10);
                sandbox.restore();
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should have 5 materials, show load more button", (done) => {
                vanStock.loadMore().then(() => {
                    expect(vanStock.material.length).toBe(5);
                    expect(vanStock.hideLoadMore).toBe(false);
                    done();
                })
            });

        }); 
        
        describe("loads 8 result", () => {
            beforeEach(() => {
                let materials: MaterialWithQuantities[] = [];
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                materials.push({} as MaterialWithQuantities);
                vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(materials);
                vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
                vanStockServiceStub.getLocalVanStockLineTotal = sandbox.stub().resolves(8);
                sandbox.restore();
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should have 5 materials, hide load more button", (done) => {
                vanStock.loadMore().then(() => {
                    expect(vanStock.material.length).toBe(8);
                    expect(vanStock.hideLoadMore).toBe(true);
                    done();
                })
            });

        });     
    });


    // describe("searchTextChanged", () => {
    //     describe("loads empty result", () => {
    //         beforeEach(() => {
    //             let materials: MaterialWithQuantities[] = [];
    //             vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(materials);
    //             vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
    //             vanStockServiceStub.getLocalVanStockTotal = sandbox.stub().resolves(0);
    //             sandbox.restore();
    //         });

    //         afterEach(() => {
    //             sandbox.restore();
    //         });

    //         it("should have empty materials", (done) => {
    //             vanStock.loadMore().then(() => {
    //                 expect(vanStock.material.length).toBe(0);
    //                 done();
    //             })
    //         });

    //     });

    //     describe("loads 5 result", () => {
    //         beforeEach(() => {
    //             let materials: MaterialWithQuantities[] = [];
    //             materials.push({} as MaterialWithQuantities);
    //             materials.push({} as MaterialWithQuantities);
    //             materials.push({} as MaterialWithQuantities);
    //             materials.push({} as MaterialWithQuantities);
    //             materials.push({} as MaterialWithQuantities);
    //             vanStockServiceStub.searchLocalVanStock = sandbox.stub().resolves(materials);
    //             vanStockServiceStub.getLocalVanStockAreaLookup = sandbox.stub().resolves([]);
    //             vanStockServiceStub.getLocalVanStockTotal = sandbox.stub().resolves(10);
    //             sandbox.restore();
    //         });

    //         afterEach(() => {
    //             sandbox.restore();
    //         });

    //         it("should have 5 materials, show load more button", (done) => {
    //             vanStock.loadMore().then(() => {
    //                 expect(vanStock.material.length).toBe(5);
    //                 expect(vanStock.hideLoadMore).toBe(false);
    //                 done();
    //             })
    //         });

    //     }); 

    // });    
});
