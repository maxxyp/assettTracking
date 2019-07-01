export class IconDetailItem {

    public iconClassName: string;
    public title: string; // provides text description of icon on hover, for e.g. if an image

    constructor(iconClassName: string) {
        this.title = "";
        this.iconClassName = iconClassName;
    }
}
