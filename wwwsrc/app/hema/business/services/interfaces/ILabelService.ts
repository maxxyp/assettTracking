export interface ILabelService {
    getGroup(groupKey: string): Promise<{ [key: string]: string}>;
    getGroupWithoutCommon(groupKey: string): Promise<{ [key: string]: string}>;
}
