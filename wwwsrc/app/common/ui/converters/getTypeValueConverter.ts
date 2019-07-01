export class GetTypeValueConverter {
    
    public toView(obj: any) : string {
        if (obj) {
            return Array.isArray(obj) ? "array" : typeof obj;
        }
        return null;
    }
}
