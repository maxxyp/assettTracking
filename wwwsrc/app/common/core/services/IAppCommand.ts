export interface IAppCommand {
    methodName: string;
    args: { [index: string]: string };
}
