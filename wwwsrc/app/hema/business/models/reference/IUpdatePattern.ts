export interface IUpdatePattern {
    type: string;
    retrieveData: boolean;
    deleteCatalog: boolean;
    tables: string;
    eTag: string;
    lastModifiedDate: string;
    majorVersion: number;
    minorVersion: number;
    sequence: number;
}
