import { NavigationInstruction, Router } from "aurelia-router";
import { EditableViewModel } from "../models/editableViewModel";
import { inject } from "aurelia-framework";

@inject(Router)
export class ViewService {

    private _router: Router;

    constructor(router: Router) {
        this._router = router;
    }

    public saveAll(): Promise<void> {
        let vms: EditableViewModel[] = this.findViewModels(this._router.currentInstruction, EditableViewModel);
        return Promise.all(vms.map(x => x.isNew ? null : x.save()))
            .return(null);
    }

    private findViewModels<T>(navigationInstruction: NavigationInstruction, withType?: Function): any[] {
        let viewModels: T[] = [];
        let viewPortInstructions = <any>navigationInstruction.viewPortInstructions;
        let defaultVP = viewPortInstructions && viewPortInstructions.default;

        if (defaultVP && defaultVP.component && defaultVP.component.viewModel && (!withType || defaultVP.component.viewModel instanceof <any>withType)) {
            viewModels.push(defaultVP.component.viewModel);
        }

        if (defaultVP.childNavigationInstruction) {
            viewModels = viewModels.concat(this.findViewModels(defaultVP.childNavigationInstruction, withType));
        }

        return viewModels;
    }

}
