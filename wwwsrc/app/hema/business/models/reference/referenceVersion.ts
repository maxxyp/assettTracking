export class ReferenceVersion {
    public table: string;
    public version: string;
    public isLocal: boolean;
    public lastModifiedDate: string;
    public majorVersion?: number;
    public minorVersion?: number;
    public sequence?: number;
    public lastAttemptFailed?: boolean;
    public source?: string;
}
