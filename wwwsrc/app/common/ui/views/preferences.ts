/// <reference path="../../../../typings/app.d.ts" />

import {IStorage} from "../../core/services/IStorage";
import {singleton} from "aurelia-dependency-injection";
import {IPreferencesView} from "./IPreferencesView";
import {BrowserLocalStorage} from "../../core/services/browserLocalStorage";
import {inject} from "aurelia-dependency-injection";
import {IPreferencesConsumer} from "./IPreferencesConsumer";

@singleton()
@inject(BrowserLocalStorage)
export class Preferences {
    public errorMessage: string;
    public successMessage: string;

    public preferences: { view: string, viewModel: IPreferencesView, consumer: IPreferencesConsumer}[];

    private _storageService: IStorage;

    constructor(storageService: IStorage) {
        this.preferences = [];

        this._storageService = storageService;
    }

    public add(view: string, viewModel: IPreferencesView, consumer: IPreferencesConsumer): void {
        this.preferences.push({view: view, viewModel: viewModel, consumer: consumer});

    }

    public attached() : Promise<void> {
        this.errorMessage = "";
        this.successMessage = "";
        return this.loadPreferences().then(() => {
            for (let i = 0; i < this.preferences.length; i++) {
                this.preferences[i].viewModel.consumerToView(this.preferences[i].consumer);
            }
        });
    }

    public loadPreferences() : Promise<any> {
        let loadPromises: Promise<any>[] = [];

        for (let i = 0; i < this.preferences.length; i++) {
            loadPromises.push(this.preferences[i].consumer.load(this._storageService));
        }

        return Promise.all(loadPromises);
    }

    public savePreferences(): Promise<any> {
        let savePromises: Promise<any>[] = [];

        for (let i = 0; i < this.preferences.length; i++) {
            savePromises.push(this.preferences[i].consumer.save(this._storageService));
        }

        return Promise.all(savePromises);
    }

    public validateAndSavePreferences(): Promise<void> {
        this.errorMessage = "";
        this.successMessage = "";
        return new Promise<void>((resolve, reject) => {
            let validatePromises: Promise<boolean>[] = [];

            for (let i = 0; i < this.preferences.length; i++) {
                validatePromises.push(this.preferences[i].viewModel.validate());
            }

            Promise.all(validatePromises).then((results) => {
                for (let i = 0; i < results.length; i++) {
                    if (!results[i]) {
                        this.errorMessage = "Preferences not saved, please check your input and try again.";
                        resolve();
                        break;
                    }
                }

                if (!this.errorMessage) {
                    for (let i = 0; i < this.preferences.length; i++) {
                        this.preferences[i].viewModel.viewToConsumer(this.preferences[i].consumer);
                    }

                    this.savePreferences().then(() => {
                        this.successMessage = "Preferences successfully saved.";
                        resolve();
                    });
                }
            });
        });
    }

    public reset(): void {
        this.errorMessage = "";
        this.successMessage = "";

        for (let i = 0; i < this.preferences.length; i++) {
            this.preferences[i].viewModel.reset();
        }
    }
}
