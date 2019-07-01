interface Window {
   startApp: {
        set: (uri: string) => {
            check: (success: () => void, error: () => void) => {};
            start: () => void;
        };
    }
}