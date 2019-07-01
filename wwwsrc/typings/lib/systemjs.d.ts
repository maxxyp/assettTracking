interface System {
    import(name: string, normalizedName: string): Promise<any>;
    normalize(name: string, parentName: string) : Promise<string>;
    register(modules: string[], cb: any) : void;
    defined: any;
    amdDefine: () => void;
    amdRequire: () => void;
    baseURL: string;
    paths: { [key: string]: string };
    meta: { [key: string]: Object };
    config: any;
}

declare var System: System;

declare module "systemjs" {
    export = System;
}
