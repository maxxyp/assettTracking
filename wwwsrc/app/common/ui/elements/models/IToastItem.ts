import { ToastPosition } from "./toastPosition";
import { ToastAction } from "./toastAction";
export interface IToastItem {
    id?: string;
    title: string;
    content: string;
    toastAction?: ToastAction;
    style: string;
    dismissTime: number;
    position?: ToastPosition;
    notificationSound?: string;
    autoDismiss?: boolean;
}
