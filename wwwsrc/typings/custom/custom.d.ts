
interface StyleSheet  {
    addImport(bstrURL: string, lIndex?: number): number;
    addPageRule(bstrSelector: string, bstrStyle: string, lIndex?: number): number;
    insertRule(rule: string, index?: number): number;
    removeRule(lIndex: number): void;
    deleteRule(index?: number): void;
    addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number;
    addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number;
    removeImport(lIndex: number): void;
    cssRules: CSSRuleList;
}
interface CSSRule  {
   selectorText:string;

}

declare var StyleSheet: {
    prototype: StyleSheet;
    new (): StyleSheet;
}

declare module "noUiSlider";
declare module "wNumb";