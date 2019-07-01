/// <reference path="../../typings/app.d.ts" />

import * as Main from "../../app/main";
import {Aurelia} from "aurelia-framework";
import {Startup} from "../../app/common/core/startup";
import {Container} from "aurelia-dependency-injection";

describe("the Main module", () => {
    let aur: Aurelia;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        aur = <Aurelia>{};
        aur.container = new Container();

        Startup.configure = sandbox.stub().returns(Promise.resolve());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can call configure", (done) => {
        Main.configure(aur).then(() => {
            done();
        });
    });
});
