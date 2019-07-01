/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {ISoundService} from "./ISoundService";
import {IAssetService} from "../../core/services/IAssetService";
import {AssetService} from "../../core/services/assetService";

const SOUND_BELL_1X: string = "bell.mp3";
const SOUND_BELL_2X: string = "bell_2x.mp3";

@inject(AssetService)
export class SoundService implements ISoundService {

    private _assetService: IAssetService;
    private _context: AudioContext;
    private _source: AudioBufferSourceNode;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;
        if (window.AudioContext) {
            this._context = new AudioContext();
        }
    }

    public async playBell(numberOfRings: number = 1): Promise<void> {

        switch (numberOfRings) {
            case 1:
                await this.play(SOUND_BELL_1X);
                break;
            case 2:
                await this.play(SOUND_BELL_2X);
                break;
            default:
                await this.play(SOUND_BELL_1X);
        }
    }

    public play(assetName: string): Promise<AudioBufferSourceNode> {
        return new Promise<AudioBufferSourceNode>((resolve, reject) => {
            this._assetService.loadArrayBuffer("sounds/" + assetName)
                .then((soundBuffer: ArrayBuffer) => {
                    this.processBuffer(soundBuffer).then((source) => {
                        source.start(0);
                        resolve(source);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public playBuffer(buffer: ArrayBuffer): Promise<AudioBufferSourceNode> {
        return new Promise<AudioBufferSourceNode>((resolve, reject) => {
            this.processBuffer(buffer).then((source) => {
                source.start(0);
                resolve(source);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public stop(source: AudioBufferSourceNode): void {
        if (source) {
            source.stop(0);
        }
    }

    private processBuffer(soundBuffer: ArrayBuffer): Promise<AudioBufferSourceNode> {
        return new Promise<AudioBufferSourceNode>((resolve, reject) => {
            this._source = this._context.createBufferSource();
            this._context.decodeAudioData(soundBuffer, (buffer) => {
                this._source.buffer = buffer;
                this._source.connect(this._context.destination);
                resolve(this._source);
            }, () => {
                reject();
            });
        });
    }
}
