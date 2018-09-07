import { EntitySpaceViewVersionState, EntitySpaceViewState, MissSlaType } from "../enums";

export class TriageStatistic {
	constructor(
		public supervisorId?: number,
		public entitySpaceViewName?: string,
		public stateStatistics?: Array<ViewStateDailyStatistic>,
		public triageAndErrorDistribution?: TriageAndErrorDistribution,
		public versionDuration?: ViewVersionDuration,
		public triageCommitDuration?: TriageCommitDuration
    ) 
    {
        this.stateStatistics = new Array<ViewStateDailyStatistic>();
        this.triageAndErrorDistribution = new TriageAndErrorDistribution();
        this.versionDuration = new ViewVersionDuration();
        this.triageCommitDuration = new TriageCommitDuration();
    }
}

export class ViewStateDailyStatistic {
	constructor(
        public date?: string, 
        public viewStateTimeStamps?: Array<ViewStateTimeStamp>
    ) 
    {
        this.viewStateTimeStamps = new Array<ViewStateTimeStamp>();
    }
}
     
export class EntitySpaceViewStateDistribution{
    constructor(
        public state?: EntitySpaceViewVersionState,
        public count?: number
    )
    {}
}

export class AllViewStateDistribution{
    constructor(
        public currentViewStateDistribution?: Array<ViewStateDistribution>,
        public originalViewStateDistribution?: Array<ViewStateDistribution>
    )
    {}
}

export class ViewStateDistribution{
    constructor(
        public state?: EntitySpaceViewState,
        public count?: number
    )
    {}
}

export class DailyErrorTriageViewName{
    constructor(
        public date?: string,
        public errorViewNames?: Set<string>,
        public triageViewNames?: Set<string>
    ){
        this.errorViewNames=new Set<string>();
        this.triageViewNames=new Set<string>();
    }
}
export class TriageAndErrorDistribution {
	constructor(
		public viewName?: string,
		public triageAndErrors?: Array<DaliyTriageAndError>,
		public totalErrorCount?: number,
		public totalTriageCount?: number
	) {}
}

export class DaliyTriageAndError {
	constructor(
		public date?: string,
		public errorStateTimeStamps?: Array<ViewStateTimeStamp>,
		public triageStateTimeStamps?: Array<ViewStateTimeStamp>,
		public errorCount?: number,
		public triageCount?: number
	) {}
}

export class ViewStateTimeStamp {
	constructor(
		public viewVersion?: string,
		public viewState?: string,
		public timeStamp?: string
	) {}
}

export class DailyCount {
	constructor(
		public viewName?: string,
		public date?: string,
		public errorCount?: number,
		public triageCount?: number
	) {}
}

export class ViewVersionDuration {
	constructor(
        public viewName?: string,
		public versionDurations?: Array<VersionDuration>,
		public averageDuration?: string,
		public latestDuration?: string,
		public latestVersion?: string
	) {}
}

export class VersionStateDuration {
	constructor(
		public viewStateTimeStamp?: ViewStateTimeStamp,
		public duration?: string
	) {}
}

export class VersionDuration{
    constructor(
        public jobDuration?:VersionStateDuration,
        public commitDuration?:VersionStateDuration,
        public availableDuration?:VersionStateDuration,
        public totalDuration?:string
    ){}
}

export class TriageCommitDuration {
	constructor(
        public viewName?: string,
		public commitStatistics?: Array<CommitStatistic>,
		public latestTriageDuration?: string,
        public latestTriagedVersion?: string,
        public averageDuration?: string
	) {}
}

export class CommitStatistic {
	constructor(
		public triageTimeStamp?: ViewStateTimeStamp,
		public standardTimeStamp?: ViewStateTimeStamp,
		public duration?: string
	) {}
}

export class ClassifiedViewVersionDuration{
    constructor(
        public CompleteViewVersionDuration?: ViewVersionDuration,
        public FakeTriageViewVersionDuration?: ViewVersionDuration,
        public TrueTriageViewVersionDuration?: ViewVersionDuration
    ) {}
}        

export class ViewVersionLatency {
    constructor(
        public supervisorId?: number,
        public viewName?: string,
        public version?: string,
        public state?: string,
        public originalState?: string,
        public updateType?: string,
        public lastBuildTimestamp?: string,
        public lastUpdateTimestamp?: string,
        public createdTimestamp?: string,
        public erroredTimestamp?: string,
        public triagedTimestamp?: string,
        public sealedTimestamp?: string,
        public lastBuildJobId?: string,
        public lastUpdateJobId?: string,
        public jobUrl?: string,
        public jobId?: string,
        public jobSubmitTimeStamp?: string,
        public jobStartTimeStamp?: string,
        public retryTime?: string,
        public queuedTime?: string,
        public runningTime?: string,
        public commitedTime?: string,
        public totalTime?: string,
        public previousVersionLatency?: string,
        public previousStandardVersionLatency?: string,
        public isMissSla?: boolean,
        public missSlaType?: MissSlaType,
        public missSlaGap?: string,
        public isFalseAlert?: boolean,
        public isTriaged?: boolean,
        public isErrored?: boolean,
        public isCommited?: boolean,
        public isSucceed?: boolean,
        public date?: string,
        public sealedDate?: string,
        public completeDate?: string,
        public completedTime?: string,
        public entitySpaceViewState?: number
    ) { }
}

export class VersionLatencyStateDetail {
    constructor(
        public queue?: VersionLatencyStateDetailUnit,
        public building?: VersionLatencyStateDetailUnit,
        public updating?: VersionLatencyStateDetailUnit,
        public commited?: VersionLatencyStateDetailUnit,
        public errored?: VersionLatencyStateDetailUnit,
        public standard?: VersionLatencyStateDetailUnit,
        public timeout?: VersionLatencyStateDetailUnit,
        public retry?: VersionLatencyStateDetailUnit
    ) {
        this.queue = new VersionLatencyStateDetailUnit();
        this.building = new VersionLatencyStateDetailUnit();
        this.updating = new VersionLatencyStateDetailUnit();
        this.commited = new VersionLatencyStateDetailUnit();
        this.errored = new VersionLatencyStateDetailUnit();
        this.standard = new VersionLatencyStateDetailUnit();
        this.timeout = new VersionLatencyStateDetailUnit();
        this.retry = new VersionLatencyStateDetailUnit();
    }
}
    
export class ViewVersionLatencyDetail {
    constructor(
        public timeStamp?: string,
        public version?: string,
        public updateType?: string,
        public versionStateDetail?: VersionLatencyStateDetail
    ) {
        this.versionStateDetail = new VersionLatencyStateDetail();
    }
}

export class VersionLatencyStateDetailUnit {
    constructor(
        public state?: string,
        public endTime?: string,
        public cost?: string,
    ) { }
}