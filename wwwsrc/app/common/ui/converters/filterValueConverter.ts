export class FilterValueConverter {
    public toView(array: any[], property: string, exp: string): any[] {
        if (array && exp) {
            if (property) {
                let splitSearchString: string[] = exp.split(" ");
                return array.filter((item: any): boolean => {
                    let searchCount = 0;
                    for (let searchItem of splitSearchString) {
                        if (item[property].toLowerCase()
                            .indexOf(searchItem.toLowerCase()) > -1) {
                            searchCount++;
                        }
                    }
                    if (searchCount === splitSearchString.length) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                let splitSearchString: string[] = exp.split(" ");
                return array.filter((item: any): boolean => {
                    let searchCount = 0;
                    for (let searchItem of splitSearchString) {
                        if (JSON.stringify(item).toLowerCase()
                            .indexOf(searchItem.toLowerCase()) > -1) {
                            searchCount++;
                        }
                    }
                    if (searchCount === splitSearchString.length) {
                        return true;
                    }
                    return false;
                });
            }
        } else {
            return array;
        }
    }
}
