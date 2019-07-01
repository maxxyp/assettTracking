export class ArrayBufferUtils {
    public static arrayBufferToString(buf: ArrayBuffer) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }
    
     public static arrayBufferUint8ToString(buf: ArrayBuffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
    
    public static stringToArrayBuffer(str: string) {
        let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        let bufView = new Uint16Array(buf);
        for (let i: number = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    
};
