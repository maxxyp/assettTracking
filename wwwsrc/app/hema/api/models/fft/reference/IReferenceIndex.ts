export interface IReferenceIndex {
    type: string;
    eTag: string;
    lastModifiedDate: string;
    currentMajorVersion?: number;
    currentMinorVersion?: number;
    sequence?: number;
}
