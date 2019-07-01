/// <reference path="../../../../../../typings/app.d.ts" />

import {TaskBusinessRuleHelper} from "../../../../../../app/hema/business/models/businessRules/taskBusinessRuleHelper";

describe("the TaskBusinessRuleHelper module", () => {
    let rules : {[key: string]: any};

    beforeEach(() => {
        rules = {
            "notDoingJobStatuses": "foo,bar",
            "notDoingTaskStatuses": "buzz,baz"
        }
    });

    it ("can return that a task is setting the job to not doing", () => {
        expect(TaskBusinessRuleHelper.isNotDoingJobStatus(rules, "foo")).toBe(true);
        expect(TaskBusinessRuleHelper.isNotDoingJobStatus(rules, "bar")).toBe(true);
    });

    it ("can return that a task is not setting the job to not doing", () => {
        expect(TaskBusinessRuleHelper.isNotDoingJobStatus(rules, "buzz")).toBe(false);
    });

    it ("can return that a task is not being done", () => {
        expect(TaskBusinessRuleHelper.isNotDoingTaskStatus(rules, "buzz")).toBe(true);
        expect(TaskBusinessRuleHelper.isNotDoingTaskStatus(rules, "baz")).toBe(true);
    });

    it ("can return that a task is being done", () => {
        expect(TaskBusinessRuleHelper.isNotDoingTaskStatus(rules, "foo")).toBe(false);
    });
});
