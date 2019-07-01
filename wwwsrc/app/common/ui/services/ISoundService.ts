export interface ISoundService {

    playBell(numberOfRings: number): Promise<void>;
    play(assetName: string): Promise<AudioBufferSourceNode>;
    playBuffer(buffer: ArrayBuffer): Promise<AudioBufferSourceNode>;
    stop(source: AudioBufferSourceNode): void;
}
