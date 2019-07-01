/// <reference path="../../../../../typings/app.d.ts" />

import {About} from "../../../../../app/common/ui/views/about";
import {AboutData} from "../../../../../app/common/ui/views/models/aboutData";
import {IAssetService} from "../../../../../app/common/core/services/IAssetService";

describe("the About module", () => {
    let about: About;
    let assetService: IAssetService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        assetService = <IAssetService>{};
        about = new About(assetService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(about).toBeDefined();
    });

    it("can map about json to view model", (done) => {
        let mockJson = <AboutData>{
            name: "mock 1",
            description: "mock 2",
            copyright: "mock 3"
        };
        assetService.loadJson = sandbox.stub().resolves(mockJson);

        about.attached().then(() => {
            expect(about.appName).toBe(mockJson.name);
            expect(about.description).toBe(mockJson.description);
            expect(about.copyright).toBe(mockJson.copyright);
            expect(about.releaseNotes).toBeUndefined();
            done();
        });
    });

    it ("should map releaseNotes when defined", (done) => {
        let version = "1.0.0";
        let date = "10th September 2012";
        let summary = "some summary";
        let details = "some details";

        let mockJson = <AboutData>{
            releaseNotes: [{ 
                version,
                date,
                summary,
                details,
            }]
        };
        assetService.loadJson = sandbox.stub().resolves(mockJson);

        about.attached().then(() => {
            expect(about.releaseNotes.length).toEqual(1);
            expect(about.releaseNotes[0].version).toBe(version);
            expect(about.releaseNotes[0].date).toBe(date);
            expect(about.releaseNotes[0].summary).toBe(summary);
            expect(about.releaseNotes[0].details).toBe(details);
            done();
        });
    });

    it ("should order releaseNotes in decending semver", (done) => {
        let mockJson = <AboutData>{
            releaseNotes: [{ 
                version: "1.0",
                date: "10th September 2012",
                summary: "summary",
                details: "details"
            }, { 
                version: "2.0.1",
                date: "10th September 2012",
                summary: "summary",
                details: "details"
            },
            { 
                version: "1.0.1",
                date: "10th September 2012",
                summary: "summary",
                details: "details"
            }]
        };
        
        assetService.loadJson = sandbox.stub().resolves(mockJson);

        about.attached().then(() => {
            expect(about.releaseNotes.length).toEqual(3);
            expect(about.releaseNotes.map(notes => {
                return notes.version;
            })).toEqual(["2.0.1", "1.0.1", "1.0"]);
            done();
        });
    });

    it ("toggleReleaseDetail should invert state", (done) => {
        let version = "1.0.0";
        let date = "10th September 2012";
        let summary = "some summary";
        let details = "some details";

        let mockJson = <AboutData>{
            releaseNotes: [{ 
                version,
                date,
                summary,
                details,
            }]
        };
        assetService.loadJson = sandbox.stub().resolves(mockJson);

        about.toggleReleaseDetailState = false;
        about.attached().then(() => {

            about.toggleReleaseDetail();

            expect(about.toggleReleaseDetailState).toBe(true);
            expect(about.toggleReleaseDetailIcon).toBe("minus");
            expect(about.toggleReleaseDetailText).toBe("Hide Detail");

            about.toggleReleaseDetail();

            expect(about.toggleReleaseDetailState).toBe(false);
            expect(about.toggleReleaseDetailIcon).toBe("plus");
            expect(about.toggleReleaseDetailText).toBe("Show Detail");
            done();
        });
    });

    it ("toggleReleaseDetail can force state", (done) => {
        let version = "1.0.0";
        let date = "10th September 2012";
        let summary = "some summary";
        let details = "some details";

        let mockJson = <AboutData>{
            releaseNotes: [{ 
                version,
                date,
                summary,
                details,
            }]
        };
        assetService.loadJson = sandbox.stub().resolves(mockJson);

        about.toggleReleaseDetailState = false;
        about.attached().then(() => {

            about.toggleReleaseDetailState = true;
            about.toggleReleaseDetailIcon = "minus";
            about.toggleReleaseDetailText = "Hide Detail";

            about.toggleReleaseDetail(false);

            expect(about.toggleReleaseDetailState).toBe(false);
            expect(about.toggleReleaseDetailIcon).toBe("plus");
            expect(about.toggleReleaseDetailText).toBe("Show Detail");

            done();
        });
    });

});
