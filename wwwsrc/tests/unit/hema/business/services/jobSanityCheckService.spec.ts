/// <reference path="../../../../../typings/app.d.ts" />

import {JobSanityCheckService} from "../../../../../app/hema/business/services/jobSanityCheckService";
import { Job } from "../../../../../app/hema/business/models/job";

describe("the JobSanityCheckService module", () => {
    let jobSanityCheckService: JobSanityCheckService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobSanityCheckService = new JobSanityCheckService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobSanityCheckService).toBeDefined();
    });


    it("will be happy with a well formed job", () => {
        let job = <Job>{
            tasks: [
                { applianceId: "foo" }
            ]
        }
        let result = jobSanityCheckService.isBadlyFormed(job);
        expect(result.isBadlyFormed).toBe(false);
    });

    it("will be unhappy when no tasks", () => {
        let job = <Job>{
            tasks: [],
            history: {
                appliances: [
                    {}
                ]
            }
        }
        let result = jobSanityCheckService.isBadlyFormed(job);
        expect(result.isBadlyFormed).toBe(true);
        expect(result.reason).toBeDefined();
    });

});
