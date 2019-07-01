import { HelpOverlayStep } from "../helpOverlayStep";
import { HelpOverlayConfig } from "../helpOverlayConfig";
export interface IHelpOverlayService {
    stepNumber: number;
    steps: HelpOverlayStep[];
    currentStep: HelpOverlayStep;
    helpActivated: boolean;
    helpOverlayConfig: HelpOverlayConfig[];
    editedConfigString: string;
    adminActivated: boolean;
    showAllSteps: boolean;
    getNextStep(): void;
    getPreviousStep(): void;
    toggleHelp(): void;
    removeElements(): void;
    addStep(newStep: HelpOverlayStep): void;
    removeStep(idToRemove: number): void;
    insertStep(): void;
    updateEditedConfigString(): void;
    processNextStep(direction: number): void;
}
