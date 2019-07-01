// import {Container} from "aurelia-dependency-injection";
// import { ReferenceDataService } from "../../app/hema/business/services/referenceDataService";
// import { IndexedDatabaseService } from "../../app/common/storage/indexedDatabaseService";
// import { AssetService } from "../../app/common/core/services/web/assetService";
// import { FftService } from "../../app/hema/api/services/fftService";
// import { EventAggregator } from "aurelia-event-aggregator";
// import { IConfigurationService } from "../../app/common/core/services/IConfigurationService";
// import { HemaStorage } from "../../app/hema/core/services/hemaStorage";
// import { FftHeaderProvider } from "../../app/hema/api/services/fftHeaderProvider";
// import { SimulationClient } from "../../app/common/simulation/simulationClient";
// import { ScenarioLoader } from "../../app/common/simulation/scenarioLoader";
// import { SchemaLoader } from "../../app/common/simulation/schemaLoader";
// import { ScenarioStore } from "../../app/common/simulation/wua/scenarioStore";

// describe("integration referenceData", () => {

//     let sandbox: Sinon.SinonSandbox;

//     beforeEach(() => {
//         sandbox = sinon.sandbox.create();
//     });

//      afterEach(() => {
//         sandbox.restore();
//     });

//     it ("test", () => {


//         let databaseService = Container.instance.get(IndexedDatabaseService);
//         let assetService = Container.instance.get(AssetService);

//         let eventAggregator = new EventAggregator();

//         let configurationService = <IConfigurationService>{};
//         configurationService.getConfiguration = sandbox.stub().returns({
//             "clients": [{
//                 "name": "simulation",
//                 "type": "simulation"
//             },],
//             "routes": [
//             {
//                 "route": "reference_index",
//                 "path": "engineers/v1/referencedata/list",
//                 "client": "simulation"
//             },
//             {
//                 "route": "reference_catalog",
//                 "path": "engineers/v1/referencedata/{catalog}",
//                 "client": "simulation"
//             }]
//         });

//         let storageService = Container.instance.get(HemaStorage);
//         let fftHeaderProvider = Container.instance.get(FftHeaderProvider);

//         Container.instance.registerInstance("SimulationClient",
//             new SimulationClient(new ScenarioLoader(new SchemaLoader(assetService), new ScenarioStore(assetService), eventAggregator, storageService)));

//         let fftService = new FftService(
//             configurationService,
//             storageService,
//             eventAggregator,
//             fftHeaderProvider
//         );

//         let refDataService = new ReferenceDataService(
//             databaseService,
//             assetService,
//             fftService,
//             eventAggregator
//         );

//         refDataService.initialise();


//     });

// });