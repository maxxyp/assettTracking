export class ArrayHelper {

    public static isArray(arr: any): boolean {
        return arr === undefined || arr === null ? false : arr instanceof Array;
    }

    public static sortByColumn<T>(arr: T[], columnName: string): T[] {
        if (arr === undefined) {
            return undefined;
        } else if (arr === null) {
            return null;
        } else {
            let sortByColumnName = (a: any, b: any): number => {
                if (a[columnName] > b[columnName]) {
                    return 1;
                }
                if (a[columnName] < b[columnName]) {
                    return -1;
                }
                return 0;
            };
            return arr.sort(sortByColumnName);
        }
    }

    public static sortByColumnDescending<T>(arr: T[], columnName: string): T[] {
        if (arr === undefined) {
            return undefined;
        } else if (arr === null) {
            return null;
        } else {
            let sortByColumnName = (a: any, b: any): number => {
                if (a[columnName] > b[columnName]) {
                    return -1;
                }
                if (a[columnName] < b[columnName]) {
                    return 1;
                }
                return 0;
            };
            return arr.sort(sortByColumnName);
        }
    }

    public static toKeyedObject<T>(arr: T[], keyFinder: (item: T) => string): {[id: string]: T} {
        return (arr || [])
            .reduce((accum, curr: T) => {
                accum[keyFinder(curr)] = curr;
                return accum;
            }, <{[id: string]: T}>{});
    }
}
