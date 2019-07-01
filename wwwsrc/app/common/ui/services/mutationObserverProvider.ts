import {IMutationObserverProvider} from "./IMutationObserverProvider";

export class MutationObserverProvider implements IMutationObserverProvider {
    public create(callback: (mutations: MutationRecord[], observer: MutationObserver) => void): MutationObserver {
        return new MutationObserver(callback);
    }
}
