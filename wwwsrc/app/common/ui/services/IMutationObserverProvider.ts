export interface IMutationObserverProvider {
    create(callback: (mutations: MutationRecord[], observer: MutationObserver) => void): MutationObserver;
}
