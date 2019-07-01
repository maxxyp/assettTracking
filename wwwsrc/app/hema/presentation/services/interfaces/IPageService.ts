
export interface IPageService {
    addOrUpdateLastVisitedPage(url: string): void;    
    getLastVisitedPage(pageName: string, pageItemId?: string): string;   
    getLastVisitedPageUrl(url: string): Promise<string>; 
}
