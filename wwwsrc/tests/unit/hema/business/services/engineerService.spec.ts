/// <reference path="../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";

import { EngineerService } from "../../../../../app/hema/business/services/engineerService";
import { IFFTService } from "../../../../../app/hema/api/services/interfaces/IFFTService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";

import { Engineer as EngineerBusinessModel, Engineer } from "../../../../../app/hema/business/models/engineer";

import { BusinessException } from "../../../../../app/hema/business/models/businessException";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { IWhoAmI } from "../../../../../app/hema/api/models/fft/whoAmI/IWhoAmI";
import { UnAuthorisedException } from "../../../../../app/hema/business/models/unAuthorisedException";
import { WhoAmIServiceConstants } from "../../../../../app/hema/business/services/constants/whoAmIServiceConstants";
import { WorkRetrievalServiceConstants } from "../../../../../app/hema/business/services/constants/workRetrievalServiceConstants";
import { EngineerServiceConstants } from "../../../../../app/hema/business/services/constants/engineerServiceConstants";
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";
import { Job } from "../../../../../app/hema/business/models/job";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { IAmIContractEngineer } from "../../../../../app/hema/api/models/fft/engineers/IAmIContractEngineer";
import { ApiException } from "../../../../../app/common/resilience/apiException";


describe("the engineerService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let engineerService: EngineerService;

    let fftServiceStub: IFFTService;
    let storageServiceStub: IStorageService;

    let eventAggregatorStub: EventAggregator;
    let catalogServiceStub: ICatalogService;
    let businessRuleServiceStub: IBusinessRuleService;

    let configurationServiceStub: IConfigurationService;

    let labelServiceStub: ILabelService;

    let eventPublishSpy: Sinon.SinonSpy;
    let setEngineerSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        fftServiceStub = <IFFTService>{};
        labelServiceStub = <ILabelService>{}
        storageServiceStub = <IStorageService>{};

        eventAggregatorStub = <EventAggregator>{};
        catalogServiceStub = <ICatalogService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        configurationServiceStub = <IConfigurationService>{};

        catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves({});
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({
            "signOnId": "signOnId",
            "signOffId": "signOffId",
        });

        configurationServiceStub.getConfiguration = sandbox.stub().resolves({
            activeDirectoryRoles: []
        });

        fftServiceStub.engineerStatusUpdate = sandbox.stub().resolves(undefined);
        fftServiceStub.engineerStatusUpdateEod = sandbox.stub().resolves(undefined);

        let engineerStore: Engineer;
        storageServiceStub.setEngineer = async (engineer: Engineer) => {engineerStore = engineer};
        storageServiceStub.getEngineer = async () => engineerStore;
        setEngineerSpy = sandbox.spy(storageServiceStub, "setEngineer");

        storageServiceStub.getJobsToDo = sandbox.stub().resolves([]);
        
        eventPublishSpy = eventAggregatorStub.publish = sandbox.stub();
        labelServiceStub.getGroup = sandbox.stub().resolves(undefined);

        engineerService = new EngineerService(storageServiceStub, fftServiceStub,
            eventAggregatorStub, catalogServiceStub, businessRuleServiceStub, configurationServiceStub, labelServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(engineerService).toBeDefined();
    });

    describe("initialise", () => {
        it("should throw exception when config is undefiend", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().resolves(undefined);

            engineerService.initialise(true, <IWhoAmI>{})
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Cannot find activeDirectoryRoles");
                    done();
                });
        });

        it("should throw exception when activeDirectoryRoles is undefined", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().resolves({
                activeDirectoryRoles: undefined
            });

            engineerService.initialise(true, <IWhoAmI>{})
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Cannot find activeDirectoryRoles");
                    done();
                });
        });

        it("should throw exception when activeDirectoryRoles is empty", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: []
            });

            engineerService.initialise(true, <IWhoAmI>{})
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Cannot find activeDirectoryRoles");
                    done();
                });
        });

        it("first time initialisation should ensure user is in remote activeDirectoryRole", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "1111111"
                    },
                    {
                        "givenname": "Mark"
                    },
                    {
                        "sn": "Millar"
                    },
                    {
                        "telephonenumber": "07557 234234"
                    }
                ],
                "roles": [
                    "d-Field-Engineer",
                    "d-Field-Apprentice",
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("1111111");
                    expect(engineer.lanId).toEqual("millarm");
                    expect(engineer.firstName).toEqual("Mark");
                    expect(engineer.roles).toEqual([
                        "d-Field-Engineer",
                        "d-Field-Apprentice",
                        "d-Field-Admin"
                    ]);
                    done();
                });
        });

        it("first time initialisation with only employeeid attribute defaults first name, last name and phone number to empty", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });
            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "1111111"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("1111111");
                    expect(engineer.lanId).toEqual("millarm");
                    expect(engineer.firstName).toEqual("");
                    expect(engineer.lastName).toEqual("");
                    expect(engineer.phoneNumber).toEqual("");
                    expect(engineer.roles).toEqual([
                        "d-Field-Admin"
                    ]);
                    done();
                });
        });

        it("first time initialisation should ensure user has attribute employeeid", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });
            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "id": "1111111"
                    }],
                "roles": [
                    "d-Field-Engineer",
                    "d-Field-Apprentice",
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual(`Your LAN user account does not have the attribute ${WhoAmIServiceConstants.WHO_AM_I_EMPLOYEEID_ATTRIBUTE}.`);
                    done();
                });
        });

        it("first time initialisation should throw unauthorised error if user is not in remote activeDirectoryRole", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "1111111"
                    },
                    {
                        "givenname": "Mark"
                    },
                    {
                        "sn": "Millar"
                    },
                    {
                        "telephonenumber": "07557 234234"
                    }
                ],
                "roles": [
                    "d-Field-Engineer",
                    "d-Field-Apprentice"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Your LAN user account does not have one of the required roles d-Field-Admin.");
                    expect(err.data).toEqual([
                        ["d-Field-Admin"]
                    ]);
                    done();
                });
        });

        it("non first time initialisation should throw un-authorisation error when role has been revoked", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "1111111";
            engineerBusinessModel.firstName = "Mark";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = [
                "d-Field-Engineer",
                "d-Field-Apprentice",
                "d-Field-Admin"
            ];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = undefined;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);
            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "1111111"
                    },
                    {
                        "givenname": "Mark"
                    },
                    {
                        "sn": "Millar"
                    },
                    {
                        "telephonenumber": "07557 234234"
                    }
                ],
                "roles": [
                    "d-Field-Engineer"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Your LAN user account does not have one of the required roles d-Field-Admin.");
                    expect(err.data).toEqual([
                        ["d-Field-Admin"]
                    ]);
                    done();
                });
        });

        it("non first time initialisation should ensure user is in remote activeDirectoryRole but not hang if whoAmI fails", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "1111111";
            engineerBusinessModel.firstName = "Mark";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = [
                "d-Field-Engineer",
                "d-Field-Apprentice",
                "d-Field-Admin"
            ];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = undefined;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.initialise(false)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("1111111");
                    expect(engineer.firstName).toEqual("Mark");
                    expect(engineer.roles).toEqual([
                        "d-Field-Engineer",
                        "d-Field-Apprentice",
                        "d-Field-Admin"
                    ]);
                    done();
                });
        });

        it("employee id's should pad-left 0 to 7 characters", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "1234"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's should only pad left with zeros if less than 7 characters", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "11111111"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("11111111");
                    done();
                });
        });

        it("employee id's should be stripped on non numerics", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMAN1234"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's should be stripped of non numerics prefixed", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMAN0001234"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's should be stripped of non numerics prefixed", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMAN0001234"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's should be stripped of non numerics (post numeric)", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMAN1234PLIkk-"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's should be stripped of non numerics (post numeric)", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMAN0001234PLIkk-"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0001234");
                    done();
                });
        });

        it("employee id's of 6 numeric should remain unchanged", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "111448"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .then (() => engineerService.getCurrentEngineer())
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0111448");
                    done();
                });
        });


        it("should throw unauthorised exception when when users employeeid has no numeric characters", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMANONETWOTHREE"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Unable to determine your WMIS engineer id from active directory.");
                    done();
                });
        });

        it("should throw unauthorised exception when when users employeeid has no numeric characters", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": "IAMMANONETWOTHREE"
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Unable to determine your WMIS engineer id from active directory.");
                    done();
                });
        });

        it("should throw unauthorised exception when when users employeeid is empty string", (done) => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                activeDirectoryRoles: ["d-Field-Admin"]
            });

            let whoAmI = <IWhoAmI>{
                "userid": "millarm",
                "attributes": [
                    {
                        "employeeid": ""
                    }],
                "roles": [
                    "d-Field-Admin"
                ]
            };

            engineerService.initialise(true, whoAmI)
                .catch((err: UnAuthorisedException) => {
                    expect(err instanceof UnAuthorisedException).toBeTruthy();
                    expect(err.reference).toEqual("initialise");
                    expect(err.message).toEqual("Your LAN user account does not have the attribute employeeid.");
                    done();
                });
        });
    });

    describe("the getCurrentEngineer method", () => {
        it("will error when storage service cant return engineer", (done) => {
            storageServiceStub.getEngineer = sandbox.stub().rejects(new BusinessException("context", "reference", "message", null, null));

            engineerService.getCurrentEngineer()
                .then(() => {
                    fail("should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBeTruthy();
                    done();
                });
        });

        it("can return engineer", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = false;
            engineerBusinessModel.status = undefined;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.getCurrentEngineer()
                .then((engineer) => {
                    expect(engineer).toBeDefined();
                    expect(engineer).not.toBeNull();
                    expect(engineer instanceof EngineerBusinessModel).toBeTruthy();
                    done();
                })
                .catch(() => {
                    fail("should not be here");
                    done();
                });
        });
    });

    describe("the getAllStatus method", () => {
        it("can be called and have no status", (done) => {
            catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves(null);

            engineerService.getAllStatus()
                .then((statuses) => {
                    expect(statuses).toBeNull();
                    done();
                });
        });

        it("can be called and have status", (done) => {
            catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves([
                {
                    fieldOprtvStatusCode: "S1",
                    fieldOprtvStatusDesc: "S1"
                },
                {
                    fieldOprtvStatusCode: "S2",
                    fieldOprtvStatusDesc: "S2"
                }
            ]);

            engineerService.getAllStatus()
                .then((statuses) => {
                    expect(statuses.length).toEqual(2);
                    done();
                });
        });

        it("can be called twice and return cached list", (done) => {
            catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves([
                {
                    fieldOprtvStatusCode: "S1",
                    fieldOprtvStatusDesc: "S1"
                },
                {
                    fieldOprtvStatusCode: "S2",
                    fieldOprtvStatusDesc: "S2"
                }
            ]);

            engineerService.getAllStatus()
                .then((statuses) => {
                    expect(statuses.length).toEqual(2);

                    catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves([]);

                    engineerService.getAllStatus()
                        .then((statuses2) => {
                            expect(statuses2.length).toEqual(2);
                            done();
                        });
                });
        });
    });

    describe("the isSignedOn method", () => {
        it("can return false when engineer does not exist", (done) => {
            storageServiceStub.getEngineer = sandbox.stub().resolves(undefined);

            engineerService.isSignedOn()
                .then((isSignedOn) => {
                    expect(isSignedOn).toBeFalsy();
                    done();
                });
        });

        it("can return false when engineer is not signed on", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.isSignedOn = false;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.isSignedOn()
                .then((isSignedOn) => {
                    expect(isSignedOn).toBeFalsy();
                    done();
                });
        });

        it("can return true when engineer is not signed on", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.isSignedOn = true;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.isSignedOn()
                .then((isSignedOn) => {
                    expect(isSignedOn).toBeTruthy();
                    done();
                });
        });
    });

    describe("the setStatus method", () => {
        it("can be called with an undefined status", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = "1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.setStatus(undefined)
                .then(() => {
                    expect(engineerBusinessModel.status).toEqual(undefined);
                    done();
                });
        });

        it("can save engineer when api is working", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = "1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);
            storageServiceStub.setEngineer = sandbox.stub().resolves(undefined);
            engineerService.setStatus("2")
                .then(() => {
                    expect((storageServiceStub.setEngineer as Sinon.SinonStub).calledWith(engineerBusinessModel)).toBe(true);
                    done();
                });
        });

        it("can throw when api is broken", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = "1";

            storageServiceStub.setEngineer = sandbox.stub().resolves(undefined);
            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);
            fftServiceStub.engineerStatusUpdateEod = sandbox.stub().rejects(new BusinessException("context", "reference", "message", null, null));

            engineerService.setStatus("signOffId")
                .catch(() => {
                    expect((storageServiceStub.setEngineer as Sinon.SinonStub).called).toBe(false);
                    done();
                });
        });

        it("can send a work retrieval request when status is changed and the engineer is signing on", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = false;
            engineerBusinessModel.status = "1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.setStatus("signOnId")
                .then(() => {
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_STATUS_CHANGED)).toBe(true);
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, true)).toBe(true);
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, false)).toBe(false);

                    expect(eventPublishSpy.calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST)).toBe(true);

                    done();
                });
        });

        it("can send a work retrieval request when status is changed and the engineer is working again", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567890";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = "1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.setStatus(undefined)
                .then(() => {
                    expect(eventPublishSpy.calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST)).toBe(true);
                    done();
                });
        });

        it("can not send a work retrieval request when status is changed and the engineer is signing off", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567891";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = "1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.setStatus("signOffId")
                .then(() => {
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_STATUS_CHANGED)).toBe(true);
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, true)).toBe(false);
                    expect(eventPublishSpy.calledWith(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, false)).toBe(true);

                    expect(eventPublishSpy.calledWith(WorkRetrievalServiceConstants)).toBe(false);
                    done();
                });
        });

        it("it should set engineer status back to working when job is active", done => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.id = "123456";
            engineerBusinessModel.firstName = "foo";
            engineerBusinessModel.lastName = "bar";
            engineerBusinessModel.phoneNumber = "1234567891";
            engineerBusinessModel.roles = ["engineer"];
            engineerBusinessModel.isSignedOn = true;
            engineerBusinessModel.status = undefined;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            let job1 = new Job();
            job1.id = "1234567890";
            job1.state = JobState.enRoute;

            let job2 = new Job();
            job2.id = "2345678901";
            job2.state = JobState.idle;

            storageServiceStub.getJobsToDo = sandbox.stub().resolves([job1, job2]);

            engineerService.setStatus("11")
                .then(() => {
                    const engineerStatus: any = setEngineerSpy.args[0];
                    expect((<EngineerBusinessModel>engineerStatus).status).toBeUndefined();
                    expect(setEngineerSpy.called).toBeTruthy();
                    done();
                });
        });
    });

    describe("the isWorking method", () => {
        it("can return false when engineer does not exist", (done) => {
            storageServiceStub.getEngineer = sandbox.stub().resolves(undefined);

            engineerService.isWorking()
                .then((isWorking) => {
                    expect(isWorking).toBeFalsy();
                    done();
                });
        });

        it("can return false when engineer is not working", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.status = "s1";
            engineerBusinessModel.isSignedOn = true;
            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.isWorking()
                .then((isWorking) => {
                    expect(isWorking).toBeFalsy();
                    done();
                });
        });

        it("can return true when engineer is working", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.status = undefined;
            engineerBusinessModel.isSignedOn = true;
            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.isWorking()
                .then((isWorking) => {
                    expect(isWorking).toBeTruthy();
                    done();
                });
        });

        it("can return false when engineer is not signed on", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.status = "s1";
            engineerBusinessModel.isSignedOn = false;
            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.isWorking()
                .then((isWorking) => {
                    expect(isWorking).toBeFalsy();
                    done();
                });
        });
    });

    describe("the getStatus method", () => {
        it("can return false when engineer does not exist", (done) => {
            storageServiceStub.getEngineer = sandbox.stub().resolves(undefined);

            engineerService.getStatus()
                .then((status) => {
                    expect(status).toBeUndefined();
                    done();
                });
        });

        it("can return status when engineer is not working", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.status = "s1";

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.getStatus()
                .then((status) => {
                    expect(status).toEqual("s1");
                    done();
                });
        });

        it("can return undefined when engineer is working", (done) => {
            let engineerBusinessModel = new EngineerBusinessModel();
            engineerBusinessModel.status = undefined;

            storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

            engineerService.getStatus()
                .then((status) => {
                    expect(status).toBeUndefined();
                    done();
                });
        });
    });

    describe("overrideEngineerId method", () => {
        let engineer: EngineerBusinessModel;
        beforeEach(() => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().resolves(
                <IAmIContractEngineer>{
                    workdayPayrollId: 1111111,
                    engineerId: "1111111",
                    contractorInd: "N"
                }
            );

            engineer = <EngineerBusinessModel> {
                id: "1111111",
                isSignedOn: false,
                firstName: "fname",
                lastName: "lname"
            };
        });

        afterEach(() => sandbox.restore());

        it("should throw business exception when wmisPayrollId and workDayPayrollId is empty string", done => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().resolves(
                <IAmIContractEngineer>{
                    workdayPayrollId: null,
                    engineerId: " ",
                    contractorInd: " "
                }
            );

            engineerService.overrideEngineerId(engineer)
                .catch((err: BusinessException) => {
                    expect(err instanceof BusinessException).toBeTruthy();
                    expect(err.reference).toEqual("overrideEngineerId");
                    expect(err.message).toContain("Invalid contract engineer's data");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeTruthy();
                    done();
                });
        });

        it("should throw business exception when getAmIContractEngineerInfo api call throws an apiException other than 404", done => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().rejects(
                new ApiException(null, null, "", [], null, "")
            );

            engineerService.overrideEngineerId(engineer)
                .catch((err: BusinessException) => {
                    expect(err instanceof BusinessException).toBeTruthy();
                    expect(err.reference).toEqual("overrideEngineerId");
                    expect(err.message).toContain("Unable to get user details (contract engineer check)'{0}'.");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeTruthy();
                    done();
                });
        });

        it("should the engineerId be equal to 1111111", done => {
            engineerService.overrideEngineerId(engineer)
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("1111111");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeTruthy();
                    done();
                });
        });

        it("should the engineerId be equal to 0000050", done => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().resolves(
                <IAmIContractEngineer>{
                    workdayPayrollId: 1111111,
                    engineerId: "0000050",
                    contractorInd: "Y"
                }
            );

            engineerService.overrideEngineerId(engineer)
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("0000050");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeTruthy();
                    done();
                });
        });        

        it("should return an engineer object when api returns 404 error response", done => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().rejects(
                new ApiException(null, null, "", [], null, "404")
            );

            engineerService.overrideEngineerId(engineer)
                .then((engineerObject) => {
                    expect(engineerObject).toBeTruthy();
                    expect(engineerObject).toEqual(engineer);
                    done();
                });
        });

        it("should throw business exception when getAmIContractEngineerInfo api returns 500 error response", done => {
            fftServiceStub.getAmIContractEngineerInfo = sandbox.stub().rejects(
                new ApiException(null, null, "", [], null, "500")
            );

            engineerService.overrideEngineerId(engineer)
                .catch((err: BusinessException) => {
                    expect(err instanceof BusinessException).toBeTruthy();
                    expect(err.reference).toEqual("overrideEngineerId");
                    expect(err.message).toContain("Unable to get user details (contract engineer check)'{0}'.");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeTruthy();
                    done();
                });
        });

        
        it("should call fftService.getAmIContractEngineerInfo when engineer.isContractor = undefined", (done) => {
            engineer.isSignedOn = true;
            engineer.isContractor = undefined;

            engineerService.overrideEngineerId(engineer)
                .then((engineerObject) => {
                    expect((fftServiceStub.getAmIContractEngineerInfo as Sinon.SinonSpy).called).toBeTruthy();
                    expect(engineerObject.isContractor).not.toBeUndefined();
                    done();
                });
        }); 
        
        it("shouldn't call api method getAmIContractEngineerInfo when isContractor exists in the localstorage", done => {
            engineer.isContractor = "N";

            engineerService.overrideEngineerId(engineer)
                .then((engineer) => {
                    expect(engineer).toBeTruthy();
                    expect(engineer.id).toEqual("1111111");
                    expect((<Sinon.SinonSpy> fftServiceStub.getAmIContractEngineerInfo).called).toBeFalsy();
                    done();
                });
        });
    });
});
