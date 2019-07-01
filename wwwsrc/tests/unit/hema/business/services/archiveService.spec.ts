/// <reference path="../../../../../typings/app.d.ts" />

// import * as moment from "moment";
import { ArchiveConstants } from "../../../../../app/hema/business/services/constants/archiveConstants";
import { ArchiveService } from "../../../../../app/hema/business/services/archiveService";
import { IDatabaseService } from "../../../../../app/common/storage/IDatabaseService";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { IHemaConfiguration } from "../../../../../app/hema/IHemaConfiguration";
import { Engineer } from '../../../../../app/hema/business/models/engineer';
import { Job } from "../../../../../app/hema/business/models/job";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { Archive } from "../../../../../app/hema/business/models/archive";
import { ArchiveJob } from "../../../../../app/hema/business/models/archiveJob";
import { Guid } from "../../../../../app/common/core/guid";
import * as moment from "moment";

describe("the ArchiveService module", () => {

    let sandbox: Sinon.SinonSandbox;
    let archiveService: ArchiveService;

    let databaseServiceStub: IDatabaseService;
    let databaseServiceStubSet: Sinon.SinonStub;

    let configServiceStub: IConfigurationService;
    let hemaConfig = <IHemaConfiguration>{};

    beforeEach(() => {

        sandbox = sinon.sandbox.create();
        databaseServiceStub = <IDatabaseService>{};
        databaseServiceStub.exists = sandbox.stub().resolves(true);
        databaseServiceStub.open = sandbox.stub().resolves(undefined);
        databaseServiceStub.getAll = sandbox.stub().resolves([]);
        databaseServiceStub.setAll = sandbox.stub().resolves(undefined);
        databaseServiceStub.create = sandbox.stub().resolves(undefined);

        databaseServiceStubSet = databaseServiceStub.set = sandbox.stub().resolves(true);

        configServiceStub = <IConfigurationService>{};
        hemaConfig.maxDaysArchiveRetrival = 10;
        configServiceStub.getConfiguration = sandbox.stub().returns(hemaConfig);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        archiveService = new ArchiveService(databaseServiceStub, configServiceStub);
        expect(archiveService).toBeDefined();
    });

    it("archive database exists, can be initialised", (done) => {
        archiveService = new ArchiveService(databaseServiceStub, configServiceStub);
        archiveService.initialise().then(() => {
            done();
        });
    });

    it("add job", (done) => {

        archiveService = new ArchiveService(databaseServiceStub, configServiceStub);
        let engineer: Engineer = new Engineer();
        engineer.id = "1";

        archiveService.addEngineerState(engineer, "enroute", "job1").then(() => {
            // const args = [];
            expect(databaseServiceStubSet.called).toBe(true);

            const [firstCall] = databaseServiceStubSet.args;
            const [database, storeName, archive] = firstCall;
            const {engineerId, timestamp, jobId, engineerStatus} = archive;

            expect(database).toBe("archive");
            expect(storeName).toBe("archive");

            expect(engineerId).toBe("1");
            expect(timestamp).toBeDefined();
            expect(jobId).toBe("job1");
            expect(engineerStatus).toBe("enroute");

            done();
        });
    });

    describe("update job", () => {

        it("can update existing uncomplete job ", done => {

            archiveService = new ArchiveService(databaseServiceStub, configServiceStub);

            let engineer: Engineer = new Engineer();
            engineer.id = "1";

            const guid = Guid.newGuid();

            // setup archive
            let archive = new Archive("1");
            archive.jobId = "1";
            archive.id = "1";
            archive.uniqueJobId = guid;
            archive.taskItems = [];

            let jobState = new ArchiveJob();
            jobState.timestamp = new Date("2017-01-01");
            jobState.state = JobState.arrived;
            archive.jobStates = [jobState];

            // setup job
            let job: Job = new Job();
            job.id = "1";
            job.uniqueId = guid;

            databaseServiceStub.getAll = sandbox.stub().resolves([archive]);

            archiveService.addUpdateJobState(job, engineer, JobState.complete).then(() => {
                expect(databaseServiceStubSet.called).toBe(true);

                const [firstCall] = databaseServiceStubSet.args;
                const archive = firstCall[2];
                const {uniqueJobId} = archive;

                expect(uniqueJobId).toBe(guid);

                done();
            });
        });

        // scenario is a job is complete, (e.g. another visit required)
        // job update brings a new job but with the same id

        it("can update job if exists already, where it adds instead", done => {
            archiveService = new ArchiveService(databaseServiceStub, configServiceStub);

            let engineer: Engineer = new Engineer();
            engineer.id = "1";

            let existingArchive = new Archive("1");
            existingArchive.jobId = "1";
            existingArchive.uniqueJobId = Guid.newGuid();
            existingArchive.taskItems = [];

            let jobState = new ArchiveJob();
            jobState.timestamp = new Date("2017-01-01");
            jobState.state = JobState.complete;
            existingArchive.jobStates = [jobState];

            databaseServiceStub.getAll = sandbox.stub().resolves([existingArchive]);

            let job: Job = new Job();
            job.id = "1";

            archiveService.addUpdateJobState(job, engineer, JobState.complete).then(() => {
                expect(databaseServiceStubSet.called).toBe(true);

                const [firstCall] = databaseServiceStubSet.args;
                const archive = firstCall[2];
                const {uniqueJobId} = archive;

                expect(uniqueJobId).toBeDefined();
                expect(uniqueJobId).not.toBe(existingArchive.uniqueJobId);

                done();
            });
        });
    });

    describe("clearing stale data", () => {
        let buildArchive = (index: number) => {
            let archive = new Archive("1");
            archive.timestamp = moment().add(-1 * index, "days").toDate();
            archive.id = index.toString();
            return archive;
        }

        let removeStub: Sinon.SinonStub;

        beforeEach(() => {
            removeStub = databaseServiceStub.remove = sandbox.stub().resolves(null);
            archiveService = new ArchiveService(databaseServiceStub, configServiceStub);
        })

        it("can leave a fresh set of data intact", async done => {
            databaseServiceStub.getAll = sandbox.stub().resolves(<Archive[]>[
                buildArchive(9),
                buildArchive(8),
                buildArchive(7),
                buildArchive(6),
                buildArchive(5),
                buildArchive(4),
                buildArchive(3),
                buildArchive(2),
                buildArchive(1),
                buildArchive(0),
            ]);

            await archiveService.initialise();

            expect(removeStub.called).toBe(false);

            done();
        })

        it("can clear stale data", async done => {
            databaseServiceStub.getAll = sandbox.stub().resolves(<Archive[]>[
                buildArchive(11),
                buildArchive(10),
                buildArchive(9),
                buildArchive(8),
                buildArchive(7),
                buildArchive(6),
                buildArchive(5),
                buildArchive(4),
                buildArchive(3),
                buildArchive(2),
                buildArchive(1),
                buildArchive(0),
            ]);

            await archiveService.initialise();

            expect(removeStub.calledTwice).toBe(true);
            expect(removeStub.calledWith(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, "10")).toBe(true);
            expect(removeStub.calledWith(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, "11")).toBe(true);

            done();
        });
    })
});