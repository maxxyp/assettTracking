export interface IValidationRule {
    test(value: any) : Promise<boolean>;
}
