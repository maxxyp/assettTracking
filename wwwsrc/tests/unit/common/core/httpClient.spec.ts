/// <reference path="../../../../typings/app.d.ts" />

import * as AurHttp from "aurelia-fetch-client";
import {Interceptor} from "aurelia-fetch-client";
import {HttpClient} from "../../../../app/common/core/httpClient";
import {Configuration} from "../../../../app/configuration";

describe("the HttpClient module", () => {
    let httpClient: HttpClient;
    let sandbox: Sinon.SinonSandbox;
    let configData: Configuration;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        configData = new Configuration();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        expect(httpClient).toBeDefined();
    });

    it("can call fetch with no parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.fetch("/base/app.config.json").then(() => {
            done();
        }).catch(() => {
            fail("Exception thrown");
        });
    });

    it("doesn't throw with an empty interceptor", (done) => {
        let interc = <Interceptor>{};
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup(null, interc);
        httpClient.fetch("/base/app.config.json", {}).then(() => {
            done();
        }).catch(() => {
            fail("Exception thrown");
        });
    });

    it("can call request interceptor", (done) => {
        let interc = <Interceptor>{ request: (req): Request => req };
        let spy = sandbox.spy(interc, "request");
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup(null, interc);
        httpClient.fetch("/base/app.config.json", {}).then(() => {
            expect(spy.calledOnce).toBeTruthy();
            done();
        }).catch(() => {
            fail("Exception thrown");
        });
    });

    it("can call response interceptor", (done) => {
        let interc = <Interceptor>{ response: (res): Response => res };
        let spy = sandbox.spy(interc, "response");
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup(null, interc);
        httpClient.fetch("/base/app.config.json", {}).then(() => {
            expect(spy.calledOnce).toBeTruthy();
            done();
        }).catch(() => {
            fail("Exception thrown");
        });
    });

    it("can get data with default query params", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.getData("", "/base/app.config.json", {})
            .catch(() => {});
    });

    it("can get data and append default query params to existing qs", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?mode=green&env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.getData("", "/base/app.config.json", { "?mode": "green" })
            .catch(() => {});
    });

    it("can get data", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json", null).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to get data: " + JSON.stringify(e));
            done();
        });
    });

    it("can get data with parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json?{param1}", { "param1": 123 }).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to get data: " + JSON.stringify(e));
            done();
        });
    });

     it("url gets query string with cache bust", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        let fetchProxy = httpClient.fetch;
        let requestUrl: string;
        httpClient.fetch = (url, req) => {
            requestUrl = url;
            return fetchProxy.call(httpClient, url, req);
        };
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json", null, true).then((config) => {
            expect(requestUrl).toContain("?_t=");
            done();
        }).catch((e) => {
            fail("failed to get data: " + JSON.stringify(e));
            done();
        });
    });

    it("can get data with cache bust", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json", null, true).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to get data: " + JSON.stringify(e));
            done();
        });
    });

    it("can fail get data with missing parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json", { "param1": 123 }).then((config) => {
            fail("should fail with missing parameter");
            done();
        }).catch(() => {
            done();
        });
    });

    it("can fail get data with missing file", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.getData<Configuration>("http://" + window.location.host + "/",
            "base/app.config.json.missing", null).then((config) => {
            fail("should fail with missing file");
            done();
        }).catch(() => {
            done();
        });
    });

    it("can post data", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.postData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", null, configData).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to post data: " + JSON.stringify(e));
            done();
        });
    });

     it("can post data with default query params", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.postData("", "/base/app.config.json", {}, {})
            .catch(() => {});
    });

    it("can post and append default query params to existing qs", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?mode=green&env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.postData("", "/base/app.config.json", { "?mode": "green" }, {})
            .catch(() => {});
    });

    it("can post data with parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.postData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json?{param1}", { "param1": 123 }, configData).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to post data: " + JSON.stringify(e));
            done();
        });
    });

    it("can fail post data with missing parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.postData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { "param1": 123 }, configData).then((config) => {
            fail("should fail with missing parameter");
            done();
        }).catch((e) => {
            done();
        });
    });

    it("can fail post data", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.postData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { "param1": 123 }, configData).then((config) => {
            fail("should fail with missing parameter");
            done();
        }).catch((e) => {
            done();
        });
    });

    it("post can fail with exception", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        let interceptorStub = <Interceptor>{};
        interceptorStub.request = (request: Request) : Request => {
            throw("error");
        };
        httpClient.setup(null, interceptorStub);
        httpClient.postData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { }, configData).then((config) => {
            fail("should fail with exception");
            done();
        }).catch((e) => {
            done();
        });
    });

    it("can put data", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.putData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", null, configData).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to put data: " + JSON.stringify(e));
            done();
        });
    });

      it("can put data with default query params", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.putData("", "/base/app.config.json", {}, {})
            .catch(() => {});
    });

    it("can put and append default query params to existing qs", (done) => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        let interc = <Interceptor>{ request: (request): Request => {
             expect(request.url).toContain("app.config.json?mode=green&env=dev");
             done();
             return request;
        }};

        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.setup({defaultQueryParams: params}, interc);
        httpClient.putData("", "/base/app.config.json", { "?mode": "green" }, {})
            .catch(() => {});
    });

    it("can put data with parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.putData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json?{param1}", { "param1": 123 }, configData).then((config) => {
            expect(config !== null).toBeDefined();
            done();
        }).catch((e) => {
            fail("failed to put data: " + JSON.stringify(e));
            done();
        });
    });

    it("can fail put data with missing parameters", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.putData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { "param1": 123 }, configData).then((config) => {
            fail("should fail with missing parameter");
            done();
        }).catch((e) => {
            done();
        });
    });

    it("can fail put data", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        httpClient.putData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { "param1": 123 }, configData).then((config) => {
            fail("should fail with missing parameter");
            done();
        }).catch((e) => {
            done();
        });
    });

    it("put can fail with exception", (done) => {
        httpClient = new HttpClient(new AurHttp.HttpClient());
        let interceptorStub = <Interceptor>{};
        interceptorStub.request = (request: Request) : Request => {
            throw("error");
        };
        httpClient.setup(null, interceptorStub);
        httpClient.putData<Configuration, void>("http://" + window.location.host + "/",
            "base/app.config.json", { }, configData).then((config) => {
            fail("should fail with exception");
            done();
        }).catch((e) => {
            done();
        });
    });
});
