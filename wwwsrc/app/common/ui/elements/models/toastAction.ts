import { IToastItem } from "./IToastItem";

export class ToastAction {
    public action?: (toast?: IToastItem) => void;
    public label?: string;
    public details: string;
    public isExpanded?: boolean;
}
