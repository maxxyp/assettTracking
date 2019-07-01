export class WindowHelper {

    public static reload(): void {
        window.location.href = window.location.href.replace(window.location.hash, "");
    }
}
