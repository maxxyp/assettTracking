/// <reference path="./systemjs.d.ts" />

interface Window {
    DeviceOrientationEvent: DeviceOrientationEvent;
    Windows: any;
    clipboardData: DataTransfer;
    jasmine: any;
    webkitURL: URL;
    isFullScreen: boolean;
    appIsDevelopment: boolean;
    appIsSource: boolean;
    appVersion: string;
    appBuildType: string;
    initialRoute: string;
    require: any;
    System: System;
    __karma__: { files: string[], start: () => void };
}

