import {SecondsToTimeValueConverter} from "../../../../../app/hema/presentation/converters/secondsToTimeValueConverter";

describe("the SecondsToTimeValueConverter module", () => {
    let secondsToTimeValueConverter: SecondsToTimeValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        secondsToTimeValueConverter = new SecondsToTimeValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(secondsToTimeValueConverter).toBeDefined();
    });

    it("can convert null to empty string", () => {
        expect(secondsToTimeValueConverter.toView(null)).toBe("");
    });

    it("can convert 0 to empty string", () => {
        expect(secondsToTimeValueConverter.toView(0)).toBe("");
    });

    it("can convert -1 to empty string", () => {
        expect(secondsToTimeValueConverter.toView(-1)).toBe("");
    });

    it("can convert 1 to 1 minute", () => {
        expect(secondsToTimeValueConverter.toView(1)).toBe("1 minute");
    });

    it("can convert 59 to 1 minute", () => {
        expect(secondsToTimeValueConverter.toView(59)).toBe("1 minute");
    });

    it("can convert 60 to 1 minute", () => {
        expect(secondsToTimeValueConverter.toView(60)).toBe("1 minute");
    });

    it("can convert 61 to 2 minutes", () => {
        expect(secondsToTimeValueConverter.toView(119)).toBe("2 minutes");
    });

    it("can convert 120 to 2 minutes", () => {
        expect(secondsToTimeValueConverter.toView(120)).toBe("2 minutes");
    });

    it("can convert 3541 to 1 hour", () => {
        expect(secondsToTimeValueConverter.toView(3541)).toBe("1 hour");
    });

    it("can convert 3600 to 1 hour", () => {
        expect(secondsToTimeValueConverter.toView(3600)).toBe("1 hour");
    });

    it("can convert 3601 to 1 hour 1 minute", () => {
        expect(secondsToTimeValueConverter.toView(3601)).toBe("1 hour 1 minute");
    });

    it("can convert 7141 to 2 hours", () => {
        expect(secondsToTimeValueConverter.toView(7141)).toBe("2 hours");
    });

    it("can convert 7200 to 2 hours", () => {
        expect(secondsToTimeValueConverter.toView(7200)).toBe("2 hours");
    });

    it("can convert 7201 to 2 hours 1 minute", () => {
        expect(secondsToTimeValueConverter.toView(7201)).toBe("2 hours 1 minute");
    });
});
