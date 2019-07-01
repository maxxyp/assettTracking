/// <reference path="../typings/app.d.ts" />
var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];
var readJSON = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function (e) {
        if (xhr.status === 200) {
            cb(JSON.parse(xhr.responseText));
        }
        else {
            console.error("readJSON error", url, xhr.statusText);
        }
    };
    xhr.onerror = function (e) {
        console.error("readJSON error", url, xhr.statusText);
    };
    xhr.send(null);
};
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        /*
         Normalize paths to RequireJS module names.
         If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
         then do not normalize the paths
         */
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ""));
    }
});
readJSON("/base/clientPackages.json", function (clientPackages) {
    var paths = {};
    var packages = [];
    for (var i = 0; i < clientPackages.items.length; i++) {
        if (clientPackages.items[i].includeInTest) {
            if (!clientPackages.items[i].package) {
                paths[clientPackages.items[i].name] =
                    clientPackages.root + "/" + (clientPackages.items[i].unitLocation ? clientPackages.items[i].unitLocation : clientPackages.items[i].location);
            }
            else {
                packages.push({
                    name: clientPackages.items[i].name,
                    location: clientPackages.root + "/" + clientPackages.items[i].package.location,
                    main: clientPackages.items[i].package.main
                });
            }
        }
    }
    var baseUrl = "/base/";
    require.config({
        baseUrl: baseUrl,
        paths: paths,
        packages: packages,
        waitSeconds: 0
    });
    require(["bluebird", "aurelia-polyfills", "aurelia-pal-browser", "whatwg-fetch"], function (promise, polyfills, aureliaPalBrowser) {
        Promise = promise;
        Promise.config({
            warnings: false,
            longStackTraces: true
        });
        createSinonPromiseStub();
        window.addEventListener("unhandledrejection", function (e) {
            var detail = e.detail;
            var cache = [];
            /* avoid circular objects */
            var objectJson = detail.reason;
            if (detail) {
                if (detail.reason) {
                    objectJson = JSON.stringify(detail.reason, function (key, value) {
                        if (typeof value === "object" && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                /* circular reference found, discard key */
                                return;
                            }
                            /* circular reference found, discard key */
                            cache.push(value);
                        }
                        return value;
                    }, "\t");
                }
            }
            var colourStart = "\u001b[33m";
            var colourEnd = "\u001b[39m";
            console.error(colourStart + "=====================================" + colourEnd);
            console.error(colourStart + "PROMISE UNHANDLED EXCEPTION ERROR:" + colourEnd);
            console.error(colourStart + "An unhandled Promise exception was triggered in one of the previous few tests but given the async nature I can't tell you exactly which one, it is usually 6 or 7 tests earlier.");
            console.error(colourStart + "This can be the result of doing sandbox.returns(Promise.Reject()).");
            console.error(colourStart + "You should use stub.resolves or stub.rejects instead.");
            console.error(colourStart + objectJson + colourEnd);
            console.error(colourStart + "Aborting..." + colourEnd);
            console.error(colourStart + "=====================================" + colourEnd);
            throw new Error("Async Test Fail");
        });
        require(["aurelia-bootstrapper"], function (aureliaBootstrapper) {
            aureliaBootstrapper.bootstrap(function (a) {
                a.use.standardConfiguration();
                aureliaPalBrowser.initialize();
                require(allTestFiles, function () {
                    window.__karma__.start();
                });
            });
        });
    });
});
/*
 Inspiration drawn from here
 https://github.com/bendrucker/sinon-as-promised/blob/master/index.js
 and
 https://github.com/bendrucker/create-thenable/blob/master/index.js
 */
function createSinonPromiseStub() {
    sinon.stub.resolves = sinon.behavior.resolves = function (val) {
        return this.returns(createThenable(Promise, function (resolve) {
            resolve(val);
        }));
    };
    sinon.stub.rejects = sinon.behavior.rejects = function (err) {
        return this.returns(createThenable(Promise, function (resolve, reject) {
            reject(err);
        }));
    };
    function createThenable(Promise, resolver) {
        return Object.keys(Promise).concat("catch", "finally", "timeout").reduce(createMethod, { then: then });
        function createMethod(thenable, name) {
            thenable[name] = method(name);
            return thenable;
        }
        function method(name) {
            return function () {
                var promise = this.then();
                return promise[name].apply(promise, arguments);
            };
        }
        function then() {
            var promise = new Promise(resolver);
            return promise.then.apply(promise, arguments);
        }
    }
}
