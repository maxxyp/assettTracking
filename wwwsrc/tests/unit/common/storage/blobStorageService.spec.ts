/// <reference path="../../../../typings/app.d.ts" />

import {BlobStorageService} from "../../../../app/common/storage/blobStorageService";
import {IBlobStorageService} from "../../../../app/common/storage/IBlobStorageService";


describe("the BlobStorageService module", () => {
    let sandbox: Sinon.SinonSandbox;
    let blobStorageService: BlobStorageService;
    let fakeLoadModule: IBlobStorageService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        window.Windows = {};
        window.Windows.Storage = {};
        window.Windows.Storage.ApplicationData = {};
        window.Windows.Storage.ApplicationData.current = {};
        window.Windows.Storage.ApplicationData.current.localFolder = {}
        blobStorageService = new BlobStorageService();

        //mock module
        fakeLoadModule = <IBlobStorageService>{};

        //mock loadModule method
        blobStorageService.loadModule = sinon.stub().returns(new Promise<IBlobStorageService>((resolve, reject) => {
            resolve(fakeLoadModule);
        }));;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(blobStorageService).toBeDefined();
    });

    it("can initialise", (done) => {
      //arrange
      let moduleInitialiseStub: Sinon.SinonStub;
      moduleInitialiseStub = sinon.stub();
      fakeLoadModule.initialise = moduleInitialiseStub;
      //act
      blobStorageService.initialise("storageName", false).then(() => {
        done();
        //assert
        expect(moduleInitialiseStub.called).toBe(true);
        //check arguments
      })
    });

    it("can closedown", (done) => {
      //arrange
      const moduleClosedownStub: Sinon.SinonStub = sinon.stub();
      fakeLoadModule.closedown = moduleClosedownStub;
      //act
      blobStorageService.closedown().then(() => {
        done();
        //assert
        expect(moduleClosedownStub.called).toBe(true);
      });
    });

    it("can write", (done) => {
      //arrange
      const moduleWriteStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";
      const someFile: string = "someFile";
      const someBlob: Blob = new Blob();

      fakeLoadModule.write = moduleWriteStub;
      //act
      blobStorageService.write(somePath, someFile, someBlob).then(()=>{
          done();
          //assert
          expect(moduleWriteStub.called).toBe(true);
          const [pathPassed, filePassed, blobPassed] = moduleWriteStub.args[0];
          expect(pathPassed).toEqual(somePath);
          expect(filePassed).toEqual(someFile);
          expect(blobPassed).toEqual(someBlob);
      });
    });

    it("can read", (done) => {
      //arrange
      const moduleReadStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";
      const someFile: string = "someFile";

      fakeLoadModule.read = moduleReadStub;
      //act
      blobStorageService.read(somePath, someFile).then(()=>{
          done();
          //assert
          expect(moduleReadStub.called).toBe(true);
          const [pathPassed, filePassed] = moduleReadStub.args[0];
          expect(pathPassed).toEqual(somePath);
          expect(filePassed).toEqual(someFile);
      });
    });

    it("can check exists", (done) => {
      //arrange
      const moduleExistsStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";
      const someFile: string = "someFile";

      fakeLoadModule.exists = moduleExistsStub;
      //act
      blobStorageService.exists(somePath, someFile).then(()=>{
          done();
          //assert
          expect(moduleExistsStub.called).toBe(true);
          const [pathPassed, filePassed] = moduleExistsStub.args[0];
          expect(pathPassed).toEqual(somePath);
          expect(filePassed).toEqual(someFile);
      });
    });

    it("can check size", (done) => {
      //arrange
      const moduleSizeStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";
      const someFile: string = "someFile";

      fakeLoadModule.size = moduleSizeStub;
      //act
      blobStorageService.size(somePath, someFile).then(()=>{
          done();
          //assert
          expect(moduleSizeStub.called).toBe(true);
          const [pathPassed, filePassed] = moduleSizeStub.args[0];
          expect(pathPassed).toEqual(somePath);
          expect(filePassed).toEqual(someFile);
      });
    });

    it("can remove", (done) => {
      //arrange
      const moduleRemoveStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";
      const someFile: string = "someFile";

      fakeLoadModule.remove = moduleRemoveStub;
      //act
      blobStorageService.remove(somePath, someFile).then(()=>{
          done();
          //assert
          expect(moduleRemoveStub.called).toBe(true);
          const [pathPassed, filePassed] = moduleRemoveStub.args[0];
          expect(pathPassed).toEqual(somePath);
          expect(filePassed).toEqual(someFile);
      });
    });

    it("can list", (done) => {
      //arrange
      const moduleListStub: Sinon.SinonStub = sinon.stub();
      const somePath: string = "somePath";

      fakeLoadModule.list = moduleListStub;

      //act
      blobStorageService.list(somePath).then(()=>{
          //assert
          expect(moduleListStub.called).toBe(true);
          const [pathPassed] = moduleListStub.args[0];
          expect(pathPassed).toEqual(somePath);
          done();
      });
    });
});
