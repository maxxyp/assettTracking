export class GoogleMapsServiceConstants {
    public static DISTANCE_MATRIX: string =
        "maps/api/distancematrix/json?units=imperial&origins={origins}&destinations={destinations}";
    public static GEOCODING: string = "maps/api/geocode/json?address={address}";
}
