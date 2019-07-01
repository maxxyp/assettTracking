export class PageModel {
    public pageName: string;
    public itemId: string;
    public routeName: string;

    constructor(pageName: string, itemId: string, routeName: string) {
        this.pageName = pageName;
        this.itemId = itemId;
        this.routeName = routeName;
    }
}
