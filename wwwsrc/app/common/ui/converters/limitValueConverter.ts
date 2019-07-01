export class LimitValueConverter {
    public toView(array: any[], count: number): any[] {
        if (array) {
            return array.slice(0, count);
        } else {
            return [];
        }
    }
}
