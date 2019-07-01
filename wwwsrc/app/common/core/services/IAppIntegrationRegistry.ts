export interface IAppIntegrationRegistry {
    boilerEfficiencyGuide: {
        navigateTo: {
            gcCode: (gcCode: string, options?: { returnUri?: boolean, returnUriText?: string, fullScreen?: boolean }) => void;
        }
    };
    customerInfo: {
        navigateTo: {
            premises: (premisesId: string, options?: { returnUri?: boolean, returnUriText?: string, fullScreen?: boolean }) => void;
        },
        subscribe: {
            customerTipsComplete: (callback: (premisesId: string) => void) => { dispose: () => void };
        }
    };
    engineerWorkBench: {
        notify: {
            customerTipsComplete: (premisesId: string) => void;
        }
    };
}
