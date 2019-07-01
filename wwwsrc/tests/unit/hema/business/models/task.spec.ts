/// <reference path="../../../../../typings/app.d.ts" />

import {Task} from "../../../../../app/hema/business/models/task";

describe("the Task module", () => {
    let task: Task;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        task = new Task(true, true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(task).toBeDefined();
    });

    describe("getNextTaskId", () => {
        it ("can return null if no active tasks passed", () => {
            expect(Task.getNextTaskId(null)).toBeNull();
            expect(Task.getNextTaskId([])).toBeNull();
            expect(Task.getNextTaskId([<Task>{ id: "9001" }])).toBe("9002");
        });

        it ("can ignore empty taskIds", () => {
            expect(Task.getNextTaskId([<Task>{}])).toBeNull();
            expect(Task.getNextTaskId([<Task>{}, <Task>{id: "9001"}, <Task>{}])).toBe("9002");
        });

        it ("can get next task id", () => {
            expect(Task.getNextTaskId([<Task>{id: "9001"}])).toBe("9002");
            expect(Task.getNextTaskId([
                <Task>{id: "9003"},
                <Task>{id: "9004"},
                <Task>{id: "9002"}
            ])).toBe("9005");
            expect(Task.getNextTaskId([<Task>{id: "99001"}])).toBe("99002");
            expect(Task.getNextTaskId([<Task>{id: "99009"}])).toBe("99010");

            expect(Task.getNextTaskId([<Task>{id: "99021"}])).toBe("99022");
            expect(Task.getNextTaskId([<Task>{id: "99099"}])).toBe("99100");

            expect(Task.getNextTaskId([<Task>{id: "99301"}])).toBe("99302");
            expect(Task.getNextTaskId([<Task>{id: "99399"}])).toBe("99400");

            expect(Task.getNextTaskId([<Task>{id: "9999999999999301"}])).toBe("9999999999999302");
        });

        it ("can return null if 999 tasks have already been done against the job", () => {
            expect(Task.getNextTaskId([<Task>{id: "8998"}])).toBe("8999");
            expect(Task.getNextTaskId([<Task>{id: "8999"}])).toBeNull();
        });

    });

    describe("getFieldTaskId", () => {
        it("can return the right 8 chars of a typical taskId", () => {
            expect(Task.getFieldTaskId("1234567002")).toBe("34567002");
        });

       it("can revert to sane fallback for a shorter than 8 character taskId", () => {
            expect(Task.getFieldTaskId("123")).toBe("00000123");
        });
    });
});
