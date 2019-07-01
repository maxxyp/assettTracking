/// <reference path="../../../../../typings/app.d.ts" />

export class Notification {
    public name: string;
    public label: string;
    public icon: string;
    public callback: () => Promise<void>;

    constructor(name: string, label: string, icon: string, callback: () => Promise<void>) {
        this.name = name;
        this.label = label;
        this.icon = icon;
        this.callback = callback;
    }
}
