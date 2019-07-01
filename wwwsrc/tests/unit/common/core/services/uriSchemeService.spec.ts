/// <reference path="../../../../../typings/app.d.ts" />

import {UriSchemeService} from "../../../../../app/common/core/services/uriSchemeService";
import {Aurelia} from "aurelia-framework";
import { IUriSchemeService } from "../../../../../app/common/core/services/IUriSchemeService";
import { Container } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import { IAppCommand } from "../../../../../app/common/core/services/IAppCommand";

describe("the UriSchemeService module", () => {
    let uriSchemeService: UriSchemeService;
    let sandbox: Sinon.SinonSandbox;
    let aureliaStub: Aurelia;
    let containerSpy: Sinon.SinonSpy;
    let routerSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        let routerStub = { navigate: (path: string, opts: any ) => {}}
        aureliaStub = <Aurelia>{};
        aureliaStub.container = <Container>{};
        aureliaStub.container.get = (key: string) => {
            return { navigate: (path: string, opts: any ) => {}}
        };

        containerSpy = sandbox.spy(aureliaStub.container, "get");
        routerSpy = sandbox.spy(routerStub, "navigate");

        uriSchemeService = new UriSchemeService(aureliaStub);
    });

    afterEach(() => {
        window.initialRoute = undefined;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(uriSchemeService).toBeDefined();
    });

    it("should invoke handleCustomURI when window.initialCommand is defined", () => {
        window.initialRoute = "some/route";
        uriSchemeService.navigateToInitialRoute();
        expect(containerSpy.alwaysCalledWith(Router));
        expect(routerSpy.alwaysCalledWith("some/route"));
    });

    it("should not invoke handleCustomURI when window.initialCommand is falsey", () => {
        uriSchemeService.navigateToInitialRoute();
        expect(containerSpy.neverCalledWith(Router));
        expect(routerSpy.neverCalledWith("some/route"));
    });

    it("should handle commands in the form `command/[the_command]` by invoking subscribers ", (done) => {
        let handleCustomUri: any;
        uriSchemeService.loadModule = () => Promise.resolve(<IUriSchemeService>{
            registerPlatform: (args: any) => {
                handleCustomUri = args;
                handleCustomUri("command/sayHello");
            }
        });

        uriSchemeService.registerPlatform();
        uriSchemeService.subscribe((command) => {
            expect(command.methodName).toEqual("sayHello");
            done();
        });
    });

     it("should not handle commands in the form `command/[the_command]` when subscriber is unsubscribed ", (done) => {
         let subscriptionCallback = (command: IAppCommand) => {
            fail("subscriber should not be called.");
        }
        uriSchemeService.subscribe(subscriptionCallback);

        let handleCustomUri: any;
        uriSchemeService.loadModule = () => Promise.resolve(<IUriSchemeService>{
            registerPlatform: (args: any) => {
                handleCustomUri = args;
                uriSchemeService.unsubscribe(subscriptionCallback);
                handleCustomUri("command/sayHello");
                done();
            }
        });

        uriSchemeService.registerPlatform();
    });

    it("should handle parse command parameters in the form `command/[the_command]?[params]`", (done) => {
        let handleCustomUri: any;
        uriSchemeService.loadModule = () => Promise.resolve(<IUriSchemeService>{
            registerPlatform: (args: any) => {
                handleCustomUri = args;
                handleCustomUri("command/sayHello?name=joeblogs");
            }
        });

        uriSchemeService.registerPlatform();
        uriSchemeService.subscribe((command) => {
            expect(command.methodName).toEqual("sayHello");
            expect(command.args["name"]).toEqual("joeblogs");
            done();
        });
    });

    it("should presume uri's not in the form `command/[the_command]?[params]` are navigation requests", (done) => {
        let containerSpy = sinon.spy(aureliaStub.container.get);

        let handleCustomUri: any;
        uriSchemeService.loadModule = () => Promise.resolve(<IUriSchemeService>{
            registerPlatform: (args: any) => {
                handleCustomUri = args;
                handleCustomUri("random/route/nlevels/deep");
                expect(containerSpy.alwaysCalledWith(Router));
                expect(routerSpy.alwaysCalledWith("random/route/nlevels/deep"))
                done();
            }
        });

        uriSchemeService.registerPlatform();
    });


});
