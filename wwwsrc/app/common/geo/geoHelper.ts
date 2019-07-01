import { PlatformHelper } from "../core/platformHelper";

export class GeoHelper {
    public static isPostCodeValid(postCode: string): boolean {
        let patternCheck: RegExp = new RegExp("^(?:(?:[A-PR-UWYZ][0-9]{1,2}|[A-PR-UWYZ][A-HK-Y][0-9]{1,2}|[A-PR-UWYZ]" +
            "[0-9][A-HJKSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRV-Y]) [0-9][ABD-HJLNP-UW-Z]{2}|GIR 0AA)$", "gi");
        if (patternCheck.test(postCode)) {
            return true;
        }
        return false;
    }

    public static formatPostCode(postCode: string): string {
        let formattedPostCode: string = null;
        let pc: string = postCode.toUpperCase().replace(/\s/g, "");

        if (pc.length >= 5 && pc.length <= 7) {
            let pattern: string = "";
            let patterns: string[] = [];
            patterns.push("A9 9AA");
            patterns.push("A9A 9AA");
            patterns.push("A99 9AA");
            patterns.push("AA9 9AA");
            patterns.push("AA9A 9AA");
            patterns.push("AA99 9AA");

            for (let i = 0; i < pc.length; i++) {
                if (/[A-Z]/.test(pc[i])) {
                    pattern += "A";
                } else if (/[0-9]/.test(pc[i])) {
                    pattern += "9";
                }
            }

            let idx: number = -1;
            for (let k: number = 0; k < patterns.length && idx === -1; k++) {
                if (patterns[k].replace(/\s/, "") === pattern) {
                    idx = k;
                }
            }

            if (idx >= 0) {
                let matchedPattern: string = patterns[idx];
                let pcIdx: number = 0;
                formattedPostCode = "";

                for (let j = 0; j < matchedPattern.length; j++) {
                    if (matchedPattern[j] === "A" || matchedPattern[j] === "9") {
                        formattedPostCode += pc[pcIdx++];
                    } else {
                        formattedPostCode += " ";
                    }
                }
            }
        }

        return formattedPostCode;
    }

    public static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let R: number = 6371; // km
        let dLat: number = GeoHelper.deg2Rad(lat2 - lat1);
        let dLon: number = GeoHelper.deg2Rad(lon2 - lon1);
        lat1 = this.deg2Rad(lat1);
        lat2 = this.deg2Rad(lat2);

        let a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

        let c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    public static async isLocationEnabled(): Promise<boolean> {
        if (PlatformHelper.getPlatform() !== "wua") {
            return true;
        }

        const accessStatus = await Windows.Devices.Geolocation.Geolocator.requestAccessAsync();
        const accessStatuses = Windows.Devices.Geolocation.GeolocationAccessStatus;
        switch (accessStatus) {
            case accessStatuses.allowed:
                return true;
            case accessStatuses.denied:
                return false;
            case accessStatuses.unspecified:
                return false;
            default:
                return false;
        }
    }

    private static deg2Rad(degrees: number): number {
        return degrees * Math.PI / 180;
    }
}
