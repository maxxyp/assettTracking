export interface IAnimationService {
    swipe(element: HTMLElement, itemArray: any[], itemPosition: number, swipeDirection: string, inClass: string, outClass: string, animationTime?: number): Promise<number>; 
    animate(element: HTMLElement, animateClass: string, animationTime?: number): Promise<void>;
}
