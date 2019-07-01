export class Guid {
    public static empty: string = "00000000-0000-0000-0000-000000000000";

    public static newGuid(): string {
        return Guid.s4() + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" +
            Guid.s4() + Guid.s4() + Guid.s4();
    }

    public static isGuid(guid: string): boolean {
        return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(guid);
    }

    private static s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}
