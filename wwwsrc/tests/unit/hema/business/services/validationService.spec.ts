/// <reference path="../../../../../typings/app.d.ts" />

import {ValidationService} from "../../../../../app/hema/business/services/validationService";
import {ILabelService} from "../../../../../app/hema/business/services/interfaces/ILabelService";
import {IDynamicRule} from "../../../../../app/hema/business/services/validation/IDynamicRule";
import {RequiredRule} from "../../../../../app/hema/business/services/validation/rules/requiredRule";
import {IsNumberRule} from "../../../../../app/hema/business/services/validation/rules/isNumberRule";
import {HasMinLengthRule} from "../../../../../app/hema/business/services/validation/rules/hasMinLengthRule";
import {HasMaxLengthRule} from "../../../../../app/hema/business/services/validation/rules/hasMaxLengthRule";
import {HasLengthBetweenRule} from "../../../../../app/hema/business/services/validation/rules/hasLengthBetweenRule";
import {IsGreaterThanOrEqualToRule} from "../../../../../app/hema/business/services/validation/rules/isGreaterThanOrEqualToRule";
import {IsLessThanOrEqualToRule} from "../../../../../app/hema/business/services/validation/rules/isLessThanOrEqualToRule";
import {IsBetweenRule} from "../../../../../app/hema/business/services/validation/rules/isBetweenRule";
import {RegExpRule} from "../../../../../app/hema/business/services/validation/rules/regExpRule";
import {PassesRule} from "../../../../../app/hema/business/services/validation/rules/passesRule";
import {ICatalogService} from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IValidation} from "../../../../../app/hema/business/models/reference/IValidation";

describe("the ValidationService module", () => {
    let validationService: ValidationService;
    let sandbox: Sinon.SinonSandbox;
    let catalogServiceStub: ICatalogService;
    let labelServiceStub: ILabelService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        catalogServiceStub= <ICatalogService>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves({
            "required": "required",
            "isNumber": "canCoerceToNumber",
            "hasLengthBetween": "hasLengthBetween",
            "hasMinLength": "hasMinLength",
            "hasMaxLength": "hasMaxLength",
            "isBetween": "isBetween",
            "isGreaterThanOrEqualTo": "isGreaterThanOrEqualTo",
            "isLessThanOrEqualTo": "isLessThanOrEqualTo",
            "regExp": "regExp"
        });

        validationService = new ValidationService(catalogServiceStub, labelServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(validationService).toBeDefined();
    });

    describe("the build method", () => {
        it("can be called with null parameters", (done) => {
            validationService.build(null, null, null)
                .then((validationController) => {
                    fail("should throw exception");
                    done();
                })
                .catch(() => {
                    done();
                });
        });

        it("can be called with undefined parameters", (done) => {
            validationService.build(undefined, undefined, undefined)
                .then((validationController) => {
                    fail("should throw exception");
                    done();
                })
                .catch(() => {
                    done();
                });
        });

        it("can be called with with class that has no static rules", (done) => {
            catalogServiceStub.getValidations = sandbox.stub().resolves(null);

            let testObject = {
                property1: "blah"
            };

            validationService.build(testObject, "testObject", undefined)
                .then((validationController) => {
                    expect(validationController).toBeDefined();
                    expect(validationController.staticRules).toEqual({});
                    done();
                });
        });

        it("can be called with with class that has empty list of static rules", (done) => {
            let testObject = {
                property1: "blah"
            };

            catalogServiceStub.getValidations = sandbox.stub().resolves([]);

            validationService.build(testObject, "testObject", undefined)
                .then((validationController) => {
                    expect(validationController).toBeDefined();
                    done();
                });
        });

        it("can be called with with class that has list of static rules", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", undefined)
                .then((validationController) => {
                    expect(Object.keys(validationController.staticRules).length).toEqual(1);
                    expect(Object.keys(validationController.validationRuleProperties).length).toEqual(1);
                    done();
                });
        });

        it("can be called with with class that has list of dynamic rules only", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IDynamicRule>{};
            rule1.property = "property1";

            let rule2 = <IDynamicRule>{};

            catalogServiceStub.getValidations = sandbox.stub().resolves([]);

            validationService.build(testObject, "testObject", [rule1, rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.dynamicRules).length).toEqual(1);
                    expect(Object.keys(validationController.validationRuleProperties).length).toEqual(1);
                    done();
                });
        });

        it("can be called with with class that has static and dynamic rules for different properties", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";

            let rule2 = <IDynamicRule>{};
            rule2.property = "property2";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.staticRules).length).toEqual(1);
                    expect(Object.keys(validationController.dynamicRules).length).toEqual(1);
                    expect(Object.keys(validationController.validationRuleProperties).length).toEqual(2);
                    done();
                });
        });

        it("can be called with with class that has static and dynamic rules for the same property", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";

            let rule2 = <IDynamicRule>{};
            rule2.property = "property1";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.staticRules).length).toEqual(1);
                    expect(Object.keys(validationController.dynamicRules).length).toEqual(1);
                    expect(Object.keys(validationController.validationRuleProperties).length).toEqual(1);
                    done();
                });
        });
    });

    describe("rule groups", () => {
        it("can create rule groups based on static rules", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.groups = "group1,group2";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(Object.keys(validationController.validationRuleGroups).length).toEqual(2);
                    done();
                });
        });

        it("can create rule groups based on dynamic rules", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.groups = "group1,group2";

            let rule2 = <IDynamicRule>{};
            rule2.property = "property1";
            rule2.groups = ["group3", "group4"];

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.validationRuleGroups).length).toEqual(4);
                    done();
                });
        });

        it("can create rule groups based on combined static and dynamic rules", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.groups = "group1,group2";

            let rule2 = <IDynamicRule>{};
            rule2.property = "property1";
            rule2.groups = ["group3", "group4"];

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.validationRuleGroups).length).toEqual(4);
                    done();
                });
        });
    });

    describe("static rules", () => {
        it("created default", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(1);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    done();
                });
        });

        it("created without required", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.required = false;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(1);
                    done();
                });
        });

        it("canCoerceToNumber", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.isNumber = true;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof IsNumberRule).toBeTruthy();
                    done();
                });
        });

        it("minLength", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.minLength = 5;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof HasMinLengthRule).toBeTruthy();
                    done();
                });
        });

        it("maxLength", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.maxLength = 5;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof HasMaxLengthRule).toBeTruthy();
                    done();
                });
        });

        it("lengthBetween", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.minLength = 1;
            rule1.maxLength = 5;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof HasLengthBetweenRule).toBeTruthy();
                    done();
                });
        });

        it("min", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.min = 1;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof IsGreaterThanOrEqualToRule).toBeTruthy();
                    done();
                });
        });

        it("max", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.max = 1;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof IsLessThanOrEqualToRule).toBeTruthy();
                    done();
                });
        });

        it("range", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.min = 1;
            rule1.max = 5;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof IsBetweenRule).toBeTruthy();
                    done();
                });
        });

        it("IsBetweenRule max/min", (done) => {
            let testObject = {
                property1: "burnerPressure"
            };

            let rule1 = <IValidation>{};
            rule1.property = "burnerPressure";
            rule1.min = 1;
            rule1.max = 5;

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["burnerPressure"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["burnerPressure"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["burnerPressure"].getValidationRules()[1] instanceof IsBetweenRule).toBeTruthy();
                    expect(validationController.staticRules["burnerPressure"].allowEmpty).toBe(undefined);
                    done();
                });
        });

        it("regEx standard message", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.regExp = "blah";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof RegExpRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRuleMessages()[1]).toEqual("regExp");
                    done();
                });
        });

        it("regEx custom message", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.regExp = "blah";
            rule1.regExpError = "foo";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(2);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof RegExpRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRuleMessages()[1]).toEqual("foo");
                    done();
                });
        });

        it("custom message", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule1 = <IValidation>{};
            rule1.property = "property1";
            rule1.message = "bar";

            catalogServiceStub.getValidations = sandbox.stub().resolves([rule1]);

            validationService.build(testObject, "testObject", [])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(1);
                    expect(validationController.validationRuleProperties["property1"].getMessage()).toEqual("bar");
                    done();
                });
        });
    });

    describe("dynamic rules", () => {
        it("condition", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule2 = <IDynamicRule>{};
            rule2.property = "property1";
            rule2.condition = () => true;

            catalogServiceStub.getValidations = sandbox.stub().resolves([]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(Object.keys(validationController.validationRuleProperties).length).toEqual(1);
                    expect(Object.keys(validationController.dynamicRules).length).toEqual(1);
                    expect(validationController.dynamicRules["property1"].condition()).toBeTruthy();
                    done();
                });
        });

        it("passes", (done) => {
            let testObject = {
                property1: "blah"
            };

            let rule2 = <IDynamicRule>{};
            rule2.property = "property1";
            rule2.passes = [
                {
                    test: () => true,
                    message: "foo"
                },
                {
                    test: () => true,
                    message: "bar"
                }];

            catalogServiceStub.getValidations = sandbox.stub().resolves([]);

            validationService.build(testObject, "testObject", [rule2])
                .then((validationController) => {
                    expect(validationController.validationRuleProperties["property1"].getValidationRules().length).toEqual(3);
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[0] instanceof RequiredRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[1] instanceof PassesRule).toBeTruthy();
                    expect(validationController.validationRuleProperties["property1"].getValidationRules()[2] instanceof PassesRule).toBeTruthy();
                    done();
                });
        });
    });
});