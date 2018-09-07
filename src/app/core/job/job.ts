// export class Job{
//     constructor(
//         public id: number,
//         public hostId: number,
//         public type: JobType,
//         public status: JobStatus,
//         public submitTime?: string,
//         public startTime?: string,
//         public endTime?: string,
//         public queueTime?: string,
//         public runningTime?: string,
//         public url?: string,
//         public aetherExperimentId?: string,
//         public completePercent?: string
//     ){}
// }

export enum JobState
{
    UnKnown = 0,
    Waiting = 1,
    Queued = 2,
    Running = 3,
    Succeeded = 4,
    Failed = 5,
    Canceled = 6,
    TimeOut = 7
}

export enum JobType{
    DataAnalysis = 1,
    EntityViewExplorer = 2,
    EntityViewStatistic = 3,
    EntityViewFilter = 4,
    EntityViewValidation = 5,
    Triage = 6   
}


export class JobPanelState{
    constructor(
        public isEnabled?: boolean,
        public isSubmiting?: boolean,
        public isRunning?: boolean,
        public isCanceling?: boolean
    ){
        this.isEnabled = true;
        this.isSubmiting = false;
        this.isRunning = false;
        this.isCanceling = false;
    } 
}