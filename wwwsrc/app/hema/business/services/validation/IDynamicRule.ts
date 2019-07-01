import {IRuleOptions} from "./IRuleOptions";

export interface IDynamicRule extends IRuleOptions {
    condition?: () => boolean;
    passes?: ({ test: () => boolean | Promise<boolean>, message: string | (() => string)})[];
    basedOn?: string;
}
