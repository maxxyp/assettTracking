/// <reference path="../../../../typings/app.d.ts" />

import * as AurHttp from "aurelia-http-client";
import {RequestBuilder} from "aurelia-http-client";
import {HttpResponseMessage} from "aurelia-http-client";
import {IHttpClient} from "../../../../app/common/core/IHttpClient";
import {BasicHttpClient} from "../../../../app/common/core/basicHttpClient";

describe("BasicHttpClient module", () => {
    let basicHttpClient: IHttpClient;
    let sandbox: Sinon.SinonSandbox;
    let httpClient: AurHttp.HttpClient;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        httpClient = new AurHttp.HttpClient();
        httpClient.configure = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
        basicHttpClient = null;
        httpClient = null;
    });

    it("can be created", () => {
        basicHttpClient = new BasicHttpClient(httpClient);
        expect(basicHttpClient).toBeDefined();
    });

    it("can call setup", (done) => {
        let configCallback: (param: RequestBuilder) => void;
        httpClient.configure = (cb: (param: RequestBuilder) => void) => {
            configCallback = cb;
            return httpClient;
        };
        basicHttpClient = new BasicHttpClient(httpClient);
        basicHttpClient.setup({ username: "username", password: "password" });
        configCallback(new AurHttp.RequestBuilder(httpClient));
        done();
    });

    it("can setup basic auth header when nocredentials true", () => {
        httpClient = new AurHttp.HttpClient();

        let rb = new AurHttp.RequestBuilder(httpClient);
        let withHeaderSpy = sandbox.spy(rb, "withHeader");
        sinon.stub(httpClient, "configure").callsArgWith(0, rb);

        basicHttpClient = new BasicHttpClient(httpClient);
        basicHttpClient.setup({ username: "test", password: "test", noCredentialsHeader: true});

        let withHeaderArgs = withHeaderSpy.args[0];

        expect(withHeaderArgs[0]).toEqual("Authorization");
        expect(withHeaderArgs[1]).toEqual("Basic dGVzdDp0ZXN0");
    });

    it("can setup withCredential request", () => {
        httpClient = new AurHttp.HttpClient();

        let rb = new AurHttp.RequestBuilder(httpClient);
        let withCredentialsSpy = sandbox.spy(rb, "withCredentials");
        let withLoginSpy = sandbox.spy(rb, "withLogin");
        sinon.stub(httpClient, "configure").callsArgWith(0, rb);

        basicHttpClient = new BasicHttpClient(httpClient);
        basicHttpClient.setup({ username: "test", password: "password"});

        let withCredentialsArgs = withCredentialsSpy.args[0];
        let withLoginArgs = withLoginSpy.args[0];

        expect(withCredentialsArgs[0]).toEqual(true);
        expect(withLoginArgs[0]).toEqual("test");
        expect(withLoginArgs[1]).toEqual("password");
    });

    it("can setup default query params", () => {
        let params: {[index: string]: string} = {
            env: "dev"
        };

        httpClient = new AurHttp.HttpClient();

        let rb = new AurHttp.RequestBuilder(httpClient);
        let withParamsSpy = sandbox.spy(rb, "withParams");
        sinon.stub(httpClient, "configure").callsArgWith(0, rb);

        basicHttpClient = new BasicHttpClient(httpClient);
        basicHttpClient.setup({defaultQueryParams: params});

        let withParamsArgs = withParamsSpy.args[0][0];
        expect(withParamsArgs).toEqual({ env: "dev"});
    });

    it("can get data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.get = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        basicHttpClient.getData<any>("http://foobar",
            "some/uri", null).then((respo) => {
                expect(respo !== null).toBeDefined();
                expect(respo.totalRows).toBeDefined();
                expect(respo.totalRows === 2).toBeTruthy();
                done();
            });
    });

    it("returns null data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.get = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = null;
            resolve(respo);
        }));
        basicHttpClient.getData<any>("http://foobar",
            "some/uri", null).then((respo) => {
                expect(respo).toBeNull();
                done();
            });
    });

    it("returns null data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.get = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = null;
            reject(respo);
        }));
        basicHttpClient.getData<any>("http://foobar",
            "some/uri", null).catch((err) => {
                expect(err).toBeDefined();
                done();
            });
    });

    it("can get data with parameters", (done) => {
        let configCallback: (param: RequestBuilder) => void;
        httpClient.configure = (cb: (param: RequestBuilder) => void) => {
            configCallback = cb;
            return httpClient;
        };
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.get = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        basicHttpClient.getData<any>("http://foobar",
            "some/uri?{param1}", { "param1": 123 }).then((respo) => {
                expect(respo !== null).toBeDefined();
                expect(respo.totalRows).toBeDefined();
                expect(respo.totalRows === 2).toBeTruthy();
                configCallback(new AurHttp.RequestBuilder(httpClient));
                done();
            });
    });

    it("can fail get data with missing parameters", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        basicHttpClient.getData<any>("http://foobar",
            "some/uri", { "param1": 123 }).catch((err) => {
                expect(err).toBeDefined();
                done();
            });
    });

    it("can post data", (done) => {
        let configCallback: (param: RequestBuilder) => void;
        httpClient.configure = (cb: (param: RequestBuilder) => void) => {
            configCallback = cb;
            return httpClient;
        };
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.post = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        basicHttpClient.postData<any, any>("http://foobar",
            "some/uri", null, { id: 2 }).then((respo) => {
                expect(respo !== null).toBeDefined();
                configCallback(new AurHttp.RequestBuilder(httpClient));
                done();
            });
    });

    it("with parameters reject post data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.post = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        let params: { [id: string]: any } = {};
        params["1"] = "abcd";
        basicHttpClient.postData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 2 })
            .catch((err) => {
                expect(err).toBeDefined();
                done();
            });
    });

    it("with parameters can post data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.post = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.postData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).then((respo) => {
                done();
            });
    });

    it("post with parameters can post data returns null", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.post = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            resolve(null);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.postData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).then((respo) => {
                done();
            });
    });

    it("post with parameters httpclient rejects", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.post = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            reject(null);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.postData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).catch((respo) => {
                done();
            });
    });

    it("can put data", (done) => {
        let configCallback: (param: RequestBuilder) => void;
        httpClient.configure = (cb: (param: RequestBuilder) => void) => {
            configCallback = cb;
            return httpClient;
        };
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.put = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        basicHttpClient.putData<any, any>("http://foobar",
            "some/uri", null, { id: 2 }).then((respo) => {
            expect(respo !== null).toBeDefined();
            configCallback(new AurHttp.RequestBuilder(httpClient));
            done();
        });
    });

    it("with parameters reject put data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.put = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        let params: { [id: string]: any } = {};
        params["1"] = "abcd";
        basicHttpClient.putData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 2 })
            .catch((err) => {
                expect(err).toBeTruthy();
            done();
        });
    });

    it("with parameters can put data", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.put = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            let respo: HttpResponseMessage = <HttpResponseMessage>{};
            respo.response = "\{ \"totalRows\": 2 }";
            resolve(respo);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.putData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).then((respo) => {
            done();
        });
    });

    it("with parameters can put data returns null", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.put = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            resolve(null);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.putData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).then((respo) => {
            done();
        });
    });

    it("with parameters httpclient rejects", (done) => {
        basicHttpClient = new BasicHttpClient(httpClient);
        httpClient.put = sandbox.stub().returns(new Promise<HttpResponseMessage>((resolve, reject) => {
            reject(null);
        }));
        let params: { [id: string]: any } = {};
        params["id"] = "id";
        basicHttpClient.putData<any, any>("http://foobar/",
            "some/uri/{id}", params, { id: 1 }).catch((respo) => {
            done();
        });
    });

});
