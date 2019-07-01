/// <reference path="../../../../../typings/app.d.ts" />

import {ISoundService} from "../../../../../app/common/ui/services/ISoundService";
import {SoundService} from "../../../../../app/common/ui/services/soundService";
import {IAssetService} from "../../../../../app/common/core/services/IAssetService";
import {SoundServiceHelper} from "./soundServiceHelper";

describe("soundService", () => {
    let sandbox: Sinon.SinonSandbox;
    let soundService: ISoundService;
    let assetServiceStub: IAssetService;

    let realAudioContext: any;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        realAudioContext = (<any>window).AudioContext;
        (<any>window).AudioContext = AudioContextStub;

    });

    afterEach(() => {
        sandbox.restore();
        (<any>window).AudioContext = realAudioContext;
    });

    it("play sound", (done) => {
        assetServiceStub = <IAssetService>{};
        soundService = new SoundService(assetServiceStub);
        assetServiceStub.loadArrayBuffer = sandbox.stub()
            .returns(Promise.resolve(SoundServiceHelper.base64ToBuffer(SoundServiceHelper.sampleMp3)));
        soundService.play("sample.mp3").then(() => {
            done();
        });
    });

    it("playBuffer sound", (done) => {
        assetServiceStub = <IAssetService>{};
        soundService = new SoundService(assetServiceStub);
        soundService.playBuffer(SoundServiceHelper.base64ToBuffer(SoundServiceHelper.sampleMp3)).then(() => {
            done();
        });
    });

    it("stop sound", () => {
        assetServiceStub = <IAssetService>{};
        soundService = new SoundService(assetServiceStub);
        let audioStub: AudioBufferSourceNode = <AudioBufferSourceNode>{};
        audioStub.stop = sandbox.stub();
        soundService.stop(audioStub);
    });

    it("stop sound when AudioBufferSourceNode is null", () => {
        assetServiceStub = <IAssetService>{};
        soundService = new SoundService(assetServiceStub);
        soundService.stop(null);
    });
});

class AudioContextStub  {
    public currentTime: number;
    public destination: AudioDestinationNode;
    public listener: AudioListener;
    public sampleRate: number;
    public state: string;

    public suspend(): Promise<void> {
        return Promise.resolve();
    }
    public resume(): Promise<void> {
        return Promise.resolve();
    }
    public close(): Promise<void> {
        return Promise.resolve();
    }
    public createMediaStreamSource(stream: any): any {
        return null;
    }
    public createAnalyser(): AnalyserNode {
        return null;
    }
    public createBiquadFilter(): BiquadFilterNode {
        return null;
    }
    public createBuffer(): AudioBuffer {
        return null;
    }
    public createBufferSource(): any {
        return {
            connect: (destination: AudioNode, output?: number, input?: number): AudioNode => null,
            start: (when?: number, offset?: number, duration?: number) => {}
        };
    }
    public createChannelMerger(numberOfInputs?: number): ChannelMergerNode {
        return null;
    }
    public createChannelSplitter(): ChannelSplitterNode {
        return null;
    }
    public createConvolver(): ConvolverNode {
        return null;
    }
    public createDelay(maxDelayTime?: number): DelayNode {
        return null;
    }
    public createDynamicsCompressor(): DynamicsCompressorNode {
        return null;
    }
    public createGain(): GainNode {
        return null;
    }
    public createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode {
        return null;
    }
    public createOscillator(): OscillatorNode {
        return null;
    }
    public createPanner(): PannerNode {
        return null;
    }
    public createPeriodicWave(real?: Float32Array, imag?: Float32Array): PeriodicWave {
        return null;
    }
    public createScriptProcessor(bufferSize?: number, numberOfInputChannel?: number, numberOfOutputChannel?: number): ScriptProcessorNode {
        return null;
    }
    public createStereoPanner(): StereoPannerNode {
        return null;
    }
    public createWaveShaper(): WaveShaperNode {
        return null;
    }
    public decodeAudioData(audioData: ArrayBuffer, successCallback?: DecodeSuccessCallback, errorCallback?: DecodeErrorCallback): PromiseLike<AudioBuffer> {
        successCallback(null);
        return null;
    }
    public createMediaStreamDestination(): void { }
    public addEventListener(): void { }
    public dispatchEvent(): boolean { return true; }
    public removeEventListener(): void { }
}




