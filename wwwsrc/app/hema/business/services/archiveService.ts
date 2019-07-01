import { IArchiveService } from "./interfaces/IArchiveService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { inject } from "aurelia-dependency-injection";
import { IDatabaseService } from "../../../common/storage/IDatabaseService";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { Archive, ARCHIVE_DATE_FORMAT } from "../models/archive";
import { ArchiveConstants } from "./constants/archiveConstants";
import { DatabaseSchema } from "../../../common/storage/models/databaseSchema";
import { DatabaseSchemaStoreIndex } from "../../../common/storage/models/databaseSchemaStoreIndex";
import { DatabaseSchemaStore } from "../../../common/storage/models/databaseSchemaStore";
import * as moment from "moment";
import { Engineer } from "../models/engineer";
import { Job } from "../models/job";
import { ArchiveTaskItem } from "../models/archiveTaskItem";
import { JobState } from "../models/jobState";
import { ArchivePart } from "../models/archivePart";
import { ArchiveJob } from "../models/archiveJob";
import { CustomerHelper } from "../../core/customerHelper";
import { ArrayHelper } from "../../../common/core/arrayHelper";
import { DateHelper } from "../../core/dateHelper";
import { LocalStorageDbService } from "../../../common/storage/localStorageDbService";
import * as Logging from "aurelia-logging";

/*
Underlying assumption is that once job is started it gets completed within the same day.
Jobs never rollover to any other day. So everthing is logged (archived) is added/updated
under same job for the current date.
*/

@inject(LocalStorageDbService, ConfigurationService)
export class ArchiveService implements IArchiveService {

  private _archiveDays: number;
  private _databaseService: IDatabaseService;
  private _logger: Logging.Logger;

  constructor(databaseService: IDatabaseService, configurationService: IConfigurationService) {
    this._archiveDays = configurationService.getConfiguration<IHemaConfiguration>().maxDaysArchiveRetrival;
    this._databaseService = databaseService;
    this._logger = Logging.getLogger("ArchiveService");
  }

  public async migrate(fromDb: IDatabaseService): Promise<
                                                    "NOTHING_TO_MIGRATE"
                                                    | "MIGRATION_ALREADY_HAPPENED"
                                                    | "HAVE_MIGRATED"
                                                    | "MIGRATION_ERROR"> {
    try {

        const dbSchema = this.getDbSchemDefinition();
        const {name: databaseName, storeSchemas } = dbSchema;
        const toDb = this._databaseService;

        if (!await fromDb.exists(databaseName, storeSchemas[0].name)) {
            this._logger.warn("Archive Service Migration", "Nothing to migrate");
            return "NOTHING_TO_MIGRATE";
        }

        if (await toDb.exists(databaseName, storeSchemas[0].name)) {
            this._logger.warn("Archive Service Migration", "Migration already happened");
            return "MIGRATION_ALREADY_HAPPENED";
        }

        // we're good to try an migrate from old to new
        await toDb.create(dbSchema);
        await toDb.open(databaseName);
        await fromDb.open(databaseName);

        for (const storeSchema of storeSchemas) {
            const existingRecords = await fromDb.getAll(databaseName, storeSchema.name);
            await toDb.setAll(databaseName, storeSchema.name, existingRecords);
        }
        this._logger.warn("Archive Service Migration", "Have migrated");
        return "HAVE_MIGRATED";

    } catch (error) {
        this._logger.warn("Archive Service Migration", "Error", error);
        return "MIGRATION_ERROR";
    }
}

  public async initialise(): Promise<void> {
    await this.createOrOpen();
    const items = (await this._databaseService.getAll<Archive>(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME)) || [];
    let itemsToDelete = items.filter(x => moment().diff(moment(x.timestamp), "days") >= this._archiveDays);

    for (let itemToDelete of itemsToDelete) {
      await this._databaseService.remove(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, itemToDelete.id);
    }
  }

  public addEngineerState(engineer: Engineer, state: string, jobId: string): Promise<void> {
    let archive = new Archive(engineer.id);
    archive.jobId = jobId;
    archive.engineerId = engineer.id;
    archive.engineerStatus = state;
    return this.updateEngineerStatus(archive, engineer.id, state);
  }

  public addUpdateJobState(job: Job, engineer: Engineer, jobState: JobState): Promise<void> {
        return this.getByJob(job.id)
            .then((archives: Archive[]) => {
      if (archives && archives.length > 0) {
        let existingArchive = archives.find(x => x.uniqueJobId === job.uniqueId);

        // if exists and not complete then update otherwise add
        if (existingArchive) {
          this.populateJobState(jobState, existingArchive);
          this.populateTasks(job, existingArchive, jobState);
          return this.update(existingArchive);
        } else {
          return this.addNewArchive(job, engineer, jobState);
        }
      } else {
        return this.addNewArchive(job, engineer, jobState);
      }
    });
  }

  public getArchiveByDate(date: string): Promise<Archive[]> {
    return this._databaseService.getAll<Archive>(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, "date", date);
  }

  public async getEarliestDate(): Promise<Date> {
    try {
      const data = await this._databaseService.getAll<Archive>(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME);
      if (!data) {
        return undefined;
      }
      const dateString = DateHelper.getMinDate(data.map(d => d.date));
      return moment(dateString, ARCHIVE_DATE_FORMAT).toDate();
    } catch (e) {
      throw e;
    }
  }

  private addNewArchive(job: Job, engineer: Engineer, jobState: JobState): Promise<void> {
    let archive = new Archive(engineer.id);
    archive.jobId = job.id;
    archive.uniqueJobId = job.uniqueId;
    this.populateJobState(jobState, archive);

    if (job.customerContact) {
      archive.address = CustomerHelper.formatCustomerAddress(job.premises);
      archive.customerName = CustomerHelper.formatCustomerContact(job.contact);
    }
    this.populateTasks(job, archive, jobState);
    return this.update(archive);
  }

  private populateJobState(newState: JobState, archive: Archive): void {
    if (!archive.jobStates) {
      archive.jobStates = [];
    }

    let newArchiveJob = new ArchiveJob();
    newArchiveJob.state = newState;
    if (newState === JobState.enRoute) {
      // user may select / de-select job multiple times
      // so we will remove previously selected job state.
      archive.jobStates = [];
    }
    if (!archive.jobStates.find(x => x.state === newArchiveJob.state)) {
      archive.jobStates.push(newArchiveJob);
    }
        let newJobStates = archive.jobStates
            .map(x => (x.state !== newState) ? x : newArchiveJob);
    archive.jobStates = newJobStates;
  }

  private update(timesheet: Archive): Promise<void> {
    return this._databaseService.set(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, timesheet);
  }

  private async updateEngineerStatus(timesheet: Archive, engineerId: string, status: string): Promise<void> {
    try {
      const currentArchive = await this.getByDate(moment().format(ARCHIVE_DATE_FORMAT));
      const sortedArchive = ArrayHelper.sortByColumnDescending<Archive>(currentArchive, "id");
      const sortedArc = sortedArchive.filter(x => x.engineerStatus);
            if (sortedArc && sortedArc[0] &&
                // tslint:disable-next-line:max-line-length
                (moment(sortedArc[0].timestamp).format(ARCHIVE_DATE_FORMAT) === moment().format(ARCHIVE_DATE_FORMAT) && sortedArc[0].engineerStatus === status)) {
        // last enginner status update is already been make for today's date. so dont do it again.
        return;
      }
      return this._databaseService.set(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, timesheet);
    } catch (e) {
      throw e;
    }
  }

  private async getByJob(jobId: string): Promise<Archive[]> {
    const archives = await this.getByDate(moment().format(ARCHIVE_DATE_FORMAT));
    if (archives) {
      return archives.filter(x => x.jobId === jobId);
    }
    return [];
  }

  private getByDate(date: string): Promise<Archive[]> {
    return this._databaseService.getAll<Archive>(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_STORENAME, "date", date);
  }

  private async createOrOpen(): Promise<void> {
    if (await this._databaseService.exists(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_DATABASE)) {
      this._databaseService.open(ArchiveConstants.ARCHIVE_DATABASE);
    } else {
      await this._databaseService.create(this.getDbSchemDefinition());
    }
  }

  private populateParts(job: Job, archiveTaskItem: ArchiveTaskItem): void {
    if (job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder) {
      let filteredParts = job.partsDetail.partsBasket.partsToOrder.filter(x => x.taskId === archiveTaskItem.taskId);
      if (filteredParts) {
        archiveTaskItem.partsToOrder = [];
        filteredParts.forEach(part => {
          let existingPart = archiveTaskItem.partsToOrder.find(x => x.stockRefereceId === part.stockReferenceId);
          if (existingPart === undefined || existingPart === null) {
            existingPart = new ArchivePart();
          }
          existingPart.description = part.description;
          existingPart.quantity = part.quantity;
          existingPart.stockRefereceId = part.stockReferenceId;
          if (!archiveTaskItem.partsToOrder.find(x => x.stockRefereceId === part.stockReferenceId)) {
            archiveTaskItem.partsToOrder.push(existingPart);
          }
        });
      }
    }
  }

  private populateTasks(job: Job, jobArchive: Archive, jobState: JobState): void {
    if (jobState === JobState.complete) {
      if (job && job.tasks && jobArchive) {
        if (!jobArchive.taskItems) {
          jobArchive.taskItems = [];
        }
        job.tasks.forEach(task => {
          if (task && task.report) {
            let archiveTask = jobArchive.taskItems.find(x => x.taskId === task.id);
            if (archiveTask === undefined || archiveTask === null) {
              archiveTask = new ArchiveTaskItem();
              archiveTask.taskId = task.id;
            }
            archiveTask.visitStatus = task.status;
            archiveTask.startTime = task.startTime;
            archiveTask.endTime = task.endTime;
            archiveTask.duration = task.workDuration;
            archiveTask.workReport = task.report;
            archiveTask.applianceType = task.applianceType;
            archiveTask.jobType = task.jobType;
            if (!jobArchive.taskItems.find(x => x.taskId === task.id)) {
              jobArchive.taskItems.push(archiveTask);
            }
            this.populateParts(job, archiveTask);
          }
        });

      }
    }
  }

  private getDbSchemDefinition(): DatabaseSchema {
    return new DatabaseSchema(ArchiveConstants.ARCHIVE_DATABASE, ArchiveConstants.ARCHIVE_DATABASE_VERSION, [
        new DatabaseSchemaStore(ArchiveConstants.ARCHIVE_STORENAME, "id", true, [
          new DatabaseSchemaStoreIndex("id", "id", true),
          new DatabaseSchemaStoreIndex("jobId", "jobId", false),
          new DatabaseSchemaStoreIndex("engineerId", "engineerId", false),
          new DatabaseSchemaStoreIndex("date", "date", false)
        ])
      ]);
  }
}
