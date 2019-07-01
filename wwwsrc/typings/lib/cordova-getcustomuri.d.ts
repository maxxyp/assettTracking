interface Window {
   GetCustomUri: {
       getUriScheme: (success: (res: string) => void, error: () => void) => void;
   }
}