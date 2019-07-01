import { IGroupBy } from "./IGroupBy";

export class GroupByValueConverter {

    public toView(array: any[], groupBy: string): IGroupBy[] {

        let groups: { [index: string]: any } = {};

        if (array) {
            array.forEach((o) => {
                let group = o[groupBy];
                if (!!group) {
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                }
            });

            if (Object.keys(groups).length === 0 && groups.constructor === Object) {
                return [];
            }
        }

        return Object.keys(groups).map((group) => {
            return {
                group: group,
                values: groups[group]
            };
        });
    }
}
