interface Cordova {
   InAppBrowser: {
       open: (uri: string, target: string, location?: string) => void;
   }
}