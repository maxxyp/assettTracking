/// <reference path="../../../../typings/app.d.ts" />

import {NamedRedirect} from "../../../../app/common/ui/namedRedirect";
import {Router} from "aurelia-router";

describe("namedRedirect", () => {
    let routerStub: Router;
    let namedRedirect: NamedRedirect;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        routerStub = <Router>{};
        routerStub.generate = sandbox.stub().returns("someurl");
        routerStub.navigate = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        namedRedirect = new NamedRedirect("");
        expect(namedRedirect).toBeDefined();
    });

    it("navigate", (done) => {
        namedRedirect = new NamedRedirect("");
        namedRedirect.navigate(routerStub).then(() => {
            done();
        });
    });

    it("name is not empty", (done) => {
        namedRedirect = new NamedRedirect("foobar");
        namedRedirect.navigate(routerStub).then(() => {
            done();
        });
    });

    it ("can use the child Router", (done) => {
        let childRouterStub = <Router>{};
        childRouterStub.generate = sandbox.stub().returns("someurl");
        let childNavigateSpy: Sinon.SinonSpy = childRouterStub.navigate = sandbox.stub().resolves(true);

        namedRedirect = new NamedRedirect("foobar", {}, {useChildRouter: true});
        namedRedirect.setRouter(childRouterStub);

        namedRedirect.navigate(routerStub).then(() => {
            expect(childNavigateSpy.calledOnce).toBe(true);
            done();
        });
    });

    it ("can not use the child Router", (done) => {
        let childRouterStub = <Router>{};
        childRouterStub.generate = sandbox.stub().returns("someurl");
        let childNavigateSpy: Sinon.SinonSpy = childRouterStub.navigate = sandbox.stub().resolves(true);

        namedRedirect = new NamedRedirect("foobar", {});
        namedRedirect.setRouter(childRouterStub);

        namedRedirect.navigate(routerStub).then(() => {
            expect(childNavigateSpy.calledOnce).toBe(false);
            done();
        });
    });
});
