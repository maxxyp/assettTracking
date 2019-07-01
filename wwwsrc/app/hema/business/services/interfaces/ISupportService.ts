import { IJobUpdate } from "../../../api/models/fft/jobs/jobupdate/IJobUpdate";

export interface ISupportService {
    getLastJobUpdate(): Promise<IJobUpdate>;
}
