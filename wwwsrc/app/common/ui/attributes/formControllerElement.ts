import {PathObserver} from "../observers/pathObserver";

export class FormControllerElement {
    public element: HTMLElement;
    public elementListener: (event: FocusEvent) => any;
    public valueBindingPropertyName: string;
    public pathObserver: PathObserver;
}
