/// <reference path="../../../../typings/app.d.ts" />

import {AssetService} from "../../core/services/assetService";
import {IAssetService} from "../../core/services/IAssetService";
import {inject, singleton} from "aurelia-dependency-injection";
import {AboutData} from "./models/aboutData";
import {ReleaseNote} from "./models/releaseNote";
import {PlatformHelper} from "../../core/platformHelper";

@inject(AssetService)
@singleton()
export class About {
    public appName: string;
    public version: string;
    public buildType: string;
    public description: string;
    public copyright: string;
    public releaseNotes: ReleaseNote[];
    public additionalViewModels: {viewModel: string, model: any}[];

    public toggleReleaseDetailState: boolean;
    public toggleReleaseDetailIcon: "minus" | "plus";
    public toggleReleaseDetailText: "Hide Detail" | "Show Detail";

    private _assetService: IAssetService;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;

        this.appName =  "";
        this.description =  "";
        this.copyright = "";
        this.version = PlatformHelper.appVersion;
        this.buildType = PlatformHelper.buildType;
        this.additionalViewModels = [];
        this.toggleReleaseDetail(false);
    }

    public addViewModel(viewModel: string, model?: any): void {
        this.additionalViewModels.push({ viewModel, model });
    }

    public attached(): Promise<void> {
        return this._assetService.loadJson<AboutData>("about.json")
            .then((about: AboutData) => {
                this.appName = about.name;
                this.description = about.description;
                this.copyright = about.copyright;
                if (about.releaseNotes && about.releaseNotes.length > 0) {
                    this.releaseNotes = about.releaseNotes
                        .sort((rn1, rn2) => this.semVerCompareDesc(rn1.version, rn2.version));
                }
            });
    }

    public toggleReleaseDetail(force?: boolean): void {
        this.toggleReleaseDetailState = force !== undefined ? force : !this.toggleReleaseDetailState;
        this.toggleReleaseDetailIcon = this.toggleReleaseDetailState ? "minus" : "plus";
        this.toggleReleaseDetailText = this.toggleReleaseDetailState ? "Hide Detail" : "Show Detail";
    }

    private semVerCompareDesc(a: string, b: string): number {
        let i: number, diff: number;
        let regExStrip0 = /(\.0+)+$/;
        let segmentsA = a.replace(regExStrip0, "").split("");
        let segmentsB = b.replace(regExStrip0, "").split("");
        let l = Math.min(segmentsB.length, segmentsA.length);

        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsB[i], 10) - parseInt(segmentsA[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsB.length - segmentsA.length;
    }
}
