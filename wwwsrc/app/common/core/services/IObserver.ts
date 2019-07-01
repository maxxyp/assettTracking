export interface IObserver<T> {
    subscribe(callback: (command: T) => void): void;
    unsubscribe(callback: (command: T) => void): void;
}
