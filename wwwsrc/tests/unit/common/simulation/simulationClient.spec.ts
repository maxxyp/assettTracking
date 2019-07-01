
import {SimulationClient} from "../../../../app/common/simulation/simulationClient";
import {IScenarioLoader} from "../../../../app/common/simulation/IScenarioLoader";

describe("Simulation client", () => {

    let simulationClient: SimulationClient;
    let sandbox: Sinon.SinonSandbox;
    let scenarioLoader: IScenarioLoader;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        scenarioLoader = <IScenarioLoader>{};
        simulationClient = new SimulationClient(<IScenarioLoader>scenarioLoader);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(simulationClient).toBeDefined();
    });

    describe("fetch", () => {

        it("should throw not implemented exception", (done) => {
            try {
                simulationClient.fetch("", null);
                fail("should throw exception");
            } catch(e) {
                done();
            }
        });
    });

    describe("getData", () => {
        let sampleJSONResponse: any = { "fakeJSON": true };
        let getStub: Sinon.SinonStub;

        beforeEach(() => {
            getStub = scenarioLoader.get = sandbox
                .stub()
                .returns(Promise.resolve(sampleJSONResponse));
        });

        it ("should throw when parameter is not specified in URL", (done) => {
            simulationClient.getData("", "/testmodel/", { id: "123"})
                .catch((error) => {
                    expect(error).toBeDefined();
                done();
            });
        });

        it ("should ignore base path arguement url", (done) => {
            simulationClient.getData("basePath", "/testmodel/{id}", { id: "123"}).then((error) => {
                expect(getStub.calledWithExactly("/testmodel/123")).toEqual(true); // doesn't contain base path
                done();
            });
        });

        it ("should return error when scenario doesn't exist", (done) => {
            // setup rejection
            getStub = scenarioLoader.get = sandbox.stub().returns(Promise.reject({statusText: "mock error"}));

            simulationClient.getData("basePath", "/testmodel/{id}", { id: "123"}).catch((error) => {
                expect(getStub.calledOnce).toEqual(true);
                expect(error.toString()).toContain("mock error");

                done();
            });
        });

        it ("should return when scenario exists", (done) => {
            simulationClient.getData("basePath", "/testmodel/{id}", { id: "123"}).then((data) => {
                expect(getStub.calledWithExactly("/testmodel/123")).toEqual(true);
                expect(data).toEqual(sampleJSONResponse);
                done();
            });
        });

        it("should URI encode query strings for file system lookups", (done) => {
            simulationClient.getData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}).then((data) => {
                expect(getStub.calledWithExactly("/testmodel/123%3Fenv%3Dblue")).toEqual(true);
                expect(data).toEqual(sampleJSONResponse);
                done();
            });
        });

        it("should fallback to a URI with no query params if not found", (done) => {
            getStub = scenarioLoader.get = sandbox.stub();

            getStub.onFirstCall().returns(Promise.reject("mock error"));
            getStub.onSecondCall().returns(Promise.resolve(sampleJSONResponse));

            simulationClient.getData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}).then((data) => {
                expect(getStub.calledTwice).toEqual(true);
                expect(getStub.calledWithExactly("/testmodel/123")).toEqual(true);
                expect(data).toEqual(sampleJSONResponse);
                done();
            });
        });
    });

    describe("postData", () => {
        let postStub: Sinon.SinonStub;

         beforeEach(() => {
            postStub = scenarioLoader.post = sandbox
                .stub()
                .returns(Promise.resolve());
        });

        it ("should throw when parameter is not specified in URL", (done) => {
            simulationClient.postData("", "/testmodel/", { id: "123"}, {})
                .catch((error) => {
                    expect(error).toBeDefined();
                done();
            });
        });

        it ("should ignore base path arguement url", (done) => {
            let postData = {};
            simulationClient.postData("basePath", "/testmodel/{id}", { id: "123"}, postData).then((error) => {
                expect(postStub.calledWithExactly("/testmodel/123", postData)).toEqual(true); // doesn't contain base path
                done();
            });
        });

        it ("should return error when scenario doesn't exist", (done) => {
            // setup rejection
            postStub = scenarioLoader.post = sandbox.stub().returns(Promise.reject({statusText: "mock error"}));

            simulationClient.postData("basePath", "/testmodel/{id}", { id: "123"}, {}).catch((error) => {
                expect(postStub.calledOnce).toEqual(true);
                expect(error.toString()).toContain("mock error");
                done();
            });
        });

        it ("should return when scenario exists", (done) => {
            let postData = {};
            simulationClient.postData("basePath", "/testmodel/{id}", { id: "123"}, postData).then((data) => {
                expect(postStub.calledWithExactly("/testmodel/123", postData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });

        it("should URI encode query strings for file system lookups", (done) => {
            let postData = {};
            simulationClient.postData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}, postData).then((data) => {
                expect(postStub.calledWithExactly("/testmodel/123%3Fenv%3Dblue", postData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });

        it("should fallback to a URI with no query params if not found", (done) => {
            let postData = {};
            postStub = scenarioLoader.post = sandbox.stub();

            postStub.onFirstCall().returns(Promise.reject("mock error"));
            postStub.onSecondCall().returns(Promise.resolve());

            simulationClient.postData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}, postData).then((data) => {
                expect(postStub.calledTwice).toEqual(true);
                expect(postStub.calledWithExactly("/testmodel/123", postData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });

    });

    describe("putData", () => {
         let putStub: Sinon.SinonStub;

         beforeEach(() => {
            putStub = scenarioLoader.put = sandbox
                .stub()
                .returns(Promise.resolve());
        });

        it ("should throw when parameter is not specified in URL", (done) => {
            simulationClient.putData("", "/testmodel/", { id: "123"}, {})
            .catch((error) => {
                expect(error).toBeDefined();
                done();
            });
        });

        it ("should ignore base path arguement url", (done) => {
            let putData = {};
            simulationClient.putData("basePath", "/testmodel/{id}", { id: "123"}, putData).then((error) => {
                expect(putStub.calledWithExactly("/testmodel/123", putData)).toEqual(true); // doesn't contain base path
                done();
            });
        });

        it ("should return error when scenario doesn't exist", (done) => {
            // setup rejection
            putStub = scenarioLoader.put = sandbox.stub().returns(Promise.reject({statusText: "mock error"}));

            simulationClient.putData("basePath", "/testmodel/{id}", { id: "123"}, {}).catch((error) => {
                expect(putStub.calledOnce).toEqual(true);
                expect(error.toString()).toContain("mock error");
                done();
            });
        });

        it ("should return when scenario exists", (done) => {
            let putData = {};
            simulationClient.putData("basePath", "/testmodel/{id}", { id: "123"}, putData).then((data) => {
                expect(putStub.calledWithExactly("/testmodel/123", putData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });

          it("should URI encode query strings for file system lookups", (done) => {
            let putData = {};
            simulationClient.putData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}, putData).then((data) => {
                expect(putStub.calledWithExactly("/testmodel/123%3Fenv%3Dblue", putData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });

        it("should fallback to a URI with no query params if not found", (done) => {
            let putData = {};
            putStub = scenarioLoader.put = sandbox.stub();

            putStub.onFirstCall().returns(Promise.reject("mock error"));
            putStub.onSecondCall().returns(Promise.resolve());

            simulationClient.putData("basePath", "/testmodel/{id}", { id: "123", "?env": "blue"}, putData).then((data) => {
                expect(putStub.calledTwice).toEqual(true);
                expect(putStub.calledWithExactly("/testmodel/123", putData)).toEqual(true);
                expect(data).toBeUndefined();
                done();
            });
        });
    });


});
