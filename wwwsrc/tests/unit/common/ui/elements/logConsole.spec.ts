/// <reference path="../../../../../typings/app.d.ts" />

import {LogConsole} from "../../../../../app/common/ui/elements/logConsole";
import {Log} from "../../../../../app/common/core/services/models/log";
import {LogLevel} from "../../../../../app/common/core/services/constants/logLevel";

describe("Log Console", () => {
    let logConsole: LogConsole;
    let eaStub: any;
    let hiddenTextStub: HTMLTextAreaElement;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        eaStub = {};
        eaStub.subscribe = sandbox.stub();
        hiddenTextStub = <HTMLTextAreaElement>{};
        hiddenTextStub.select = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", (done) => {
        logConsole = new LogConsole(eaStub);
        expect(eaStub).toBeDefined();
        done();
    });

    it("updatelog", (done) => {
        let callback: (logs: Log[]) => void;
        eaStub.subscribe = (en: any, cb: any) => { callback = cb; };
        logConsole = new LogConsole(eaStub);
        expect(eaStub).toBeDefined();
        let logs: Log[] = [];
        let l: Log = new Log();
        l.logLevel = LogLevel.INFO;
        l.logText = "foo";
        logs.push(l);
        callback(logs);
        done();
    });

    it("attached", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = hiddenTextStub;
        logConsole.attached().then(() => {
            done();
        });
    });

    it("attached when hiddenfield is undefined", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = undefined;
        logConsole.attached().then(() => {
            done();
        });
    });

    it("copy", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = hiddenTextStub;
        logConsole.logs = [];
        let log: Log = new Log();
        log.logLevel = LogLevel.DEBUG;
        log.logText = "Some text";
        logConsole.logs.push(log);
        document.queryCommandSupported = sandbox.stub().returns(true);
        document.execCommand = sandbox.stub();
        logConsole.copy().then(() => {
            done();
        });
    });

    it("copy hiddenText undefined", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = undefined;
        logConsole.logs = [];
        let log: Log = new Log();
        log.logLevel = LogLevel.DEBUG;
        log.logText = "Some text";
        logConsole.logs.push(log);
        document.queryCommandSupported = sandbox.stub().returns(true);
        document.execCommand = sandbox.stub();
        logConsole.copy().then(() => {
            done();
        });
    });

    it("copy log is undefined", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = hiddenTextStub;
        logConsole.logs = [];
        let log: Log = undefined;
        logConsole.logs.push(log);
        document.queryCommandSupported = sandbox.stub().returns(true);
        document.execCommand = sandbox.stub();
        logConsole.copy().then(() => {
            done();
        });
    });

    it("can not copy", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = hiddenTextStub;
        logConsole.logs = [];
        let log: Log = new Log();
        log.logLevel = LogLevel.DEBUG;
        log.logText = "Some text";
        logConsole.logs.push(log);
        document.queryCommandSupported = sandbox.stub().returns(false);
        document.execCommand = sandbox.stub();
        logConsole.copy().then(() => {
            done();
        });
    });

    it("copy throws error", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.hiddenText = hiddenTextStub;
        logConsole.logs = [];
        let log: Log = new Log();
        log.logLevel = LogLevel.DEBUG;
        log.logText = "Some text";
        logConsole.logs.push(log);
        document.queryCommandSupported = sandbox.stub().throws(new Error());
        logConsole.copy().then(() => {
            done();
        });
    });

    it("clear", (done) => {
        logConsole = new LogConsole(eaStub);
        logConsole.clear().then(() => {
            done();
        });
    });

});
