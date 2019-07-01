export class SortValueConverter {
    public toView(array: any[], propertyName?: string, direction?: string): any[] {
        if (array && array.length > 0) {
            let factor: number = (direction || "ascending") === "ascending" ? 1 : -1;
            if (propertyName) {
                if (array[0].hasOwnProperty(propertyName)) {
                    return array
                        .slice(0)
                        .sort((a: any, b: any) => {
                            return (a[propertyName] >= b[propertyName] ? 1 : -1) * factor;
                        });
                } else {
                    return array;
                }
            } else {
                return array
                    .slice(0)
                    .sort((a: any, b: any) => {
                        return (a >= b ? 1 : -1) * factor;
                    });
            }
        } else {
            return [];
        }
    }
}
