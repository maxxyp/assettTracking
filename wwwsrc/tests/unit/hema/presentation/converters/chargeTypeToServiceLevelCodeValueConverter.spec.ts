import {ChargeTypeToServiceLevelCodeValueConverter} from "../../../../../app/hema/presentation/converters/chargeTypeToServiceLevelCodeValueConverter";

describe("the ChargeTypeToServiceLevelCodeValueConverter module", () => {
    let chargeTypeToServiceLevelCodeValueConverter: ChargeTypeToServiceLevelCodeValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        chargeTypeToServiceLevelCodeValueConverter = new ChargeTypeToServiceLevelCodeValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter).toBeDefined();
    });

    it("can convert when in normal form", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("XXX1YYY")).toBe("1YYY");
    });

    it("can convert when digit is last in string", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("XXX1")).toBe("1");
    });

    it("can convert when digit is first in string", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("1YYY")).toBe("1YYY");
    });

    it("can convert when multiple digits in string", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("XXX1Y2YY")).toBe("1Y2YY");
    });

    it("can convert when starts and ends with digit", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("1XXXYYY2")).toBe("1XXXYYY2");
    });

    it("can convert when no digits in string", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("XXXYYY")).toBe(null);
    });

    it("can not error when passed empty string", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView("")).toBe(null);
    });

    it("can not error when passed null", () => {
        expect(chargeTypeToServiceLevelCodeValueConverter.toView(null)).toBe(null);
    });
});
