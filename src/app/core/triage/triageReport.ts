import { ViewVersionLatency } from "./triageStatistic";
import { TriageViewSupervisor } from "./triageViewSupervisor";
import { MissSlaType } from "../enums";
import '../../helper/arrayExtension';

export class TriageReport {
	constructor(
		public reportTimeSpan?: string,
		public type?: string,
		public createdTime?: string,
		public startDate?: string,
		public endDate?: string,
		public triageReportSummary?: TriageReportSummary,
		public triageReportDetails?: Array<TriageReportDetail>
	) {
		this.triageReportSummary = new TriageReportSummary();
		this.triageReportDetails = new Array<TriageReportDetail>();
	}
}

export class TriageReportSummary {
    constructor(
        public allViewCount?: number,
        public allRefreshTimes?: number,
        public everyVersionRefreshtimes?: number,
        public majorVersionRefreshtimes?: number,
        public manualRefreshtimes?: number,
        public errorPercent?: number,
        public missSlaPercent?: number,
        public triagePercent?: number,
        public missSlaSummary?: MissSlaSummary,
        public errorSummary?: ErrorSummary,
        public longLatencySummary?: LongLatencySummary,
        public triageSummary?: TriageSummary,
        public rankSummary?: RankSummary
    ) {
        this.missSlaSummary = new MissSlaSummary();
        this.errorSummary = new ErrorSummary();
        this.longLatencySummary = new LongLatencySummary();
        this.triageSummary = new TriageSummary();
        this.rankSummary = new RankSummary();
    }

    get currentMissSLAViewsPercent():number{
        return Number((this.missSlaPercent * 100).toFixed(2));
    }

    get currentTriagedViewsPercent():number{
        return Number((this.triagePercent * 100).toFixed(2));
    } 

    get currentErrorViewsPercent():number{
        return Number((this.triagePercent * 100).toFixed(2));
    } 
}

export class MissSlaSummary {
	constructor(
		public missSlaViewCount?: number,
		public missSlaTimes?: number,
		public everyVersion?: MissSlaFacet,
		public majorVersion?: MissSlaFacet,
		public manual?: MissSlaFacet
	) {}

	get allMissSlaViewIds(): Array<number> {
		let allMissSlaViewIds = new Array<number>();
		allMissSlaViewIds = this.everyVersion.allViewIds
			.concat(this.majorVersion.allViewIds)
			.concat(this.manual.allViewIds);
		return allMissSlaViewIds.distinct();
    }
    
    currentMissSLATimesPercent(missSlaSummary:MissSlaSummary,triageReportSummary:TriageReportSummary){
        return Number(((missSlaSummary.missSlaTimes / triageReportSummary.allRefreshTimes) * 100).toFixed(2));
    }

}

export class MissSlaFacet {
	constructor(
		public rootCauseToSucceedIds?: RootCauseFacet,
		public rootCauseToFailedIds?: RootCauseFacet,
		public succeedViewCount?: number,
		public failedViewCount?: number,
		public stateCount?: number,
		public missSlaTimes?: number,
		public aveSlaGap?: number
	) {}

	get allViewIds(): Array<number> {
		let allViewIds = new Array<number>();
		allViewIds = this.rootCauseToSucceedIds.allIds.concat(this.rootCauseToFailedIds.allIds);
		return allViewIds.distinct();
	}

	get missSlaViewsPercent(): number {
		return Number(((this.allViewIds.length / this.stateCount) * 100).toFixed(2));
    }

    missSlaEveryVersionPercent(missSlaFacet:MissSlaFacet,triageReportSummary:TriageReportSummary){
        return Number(((missSlaFacet.missSlaTimes / triageReportSummary.everyVersionRefreshtimes) * 100).toFixed(2));
    }

    missSlaMajorVersionPercent(missSlaFacet:MissSlaFacet,triageReportSummary:TriageReportSummary){
        return Number(((missSlaFacet.missSlaTimes / triageReportSummary.majorVersionRefreshtimes) * 100).toFixed(2));
    }

    missSlaManualPercent(missSlaFacet:MissSlaFacet,triageReportSummary:TriageReportSummary){
        return Number(((missSlaFacet.missSlaTimes / triageReportSummary.manualRefreshtimes) * 100).toFixed(2));
    }
}

export class RootCauseFacet {
	constructor(
		public unknow?: Array<number>,
		public triage?: Array<number>,
		public error?: Array<number>,
		public noSchedule?: Array<number>,
		public lateSchedule?: Array<number>,
		public longQueue?: Array<number>,
		public longRunning?: Array<number>
    ) {}
    
    get unknowIds(): Array<number>{
        return this.unknow ? this.StringToNumber(Object.keys(this.unknow)) : [];
    }

    get triageIds(): Array<number>{
        return this.triage ? this.StringToNumber(Object.keys(this.triage)) : [];
    }

    get errorIds(): Array<number>{
        return this.error ? this.StringToNumber(Object.keys(this.error)) : [];
    }

    get noScheduleIds(): Array<number>{
        return this.noSchedule ? this.StringToNumber(Object.keys(this.noSchedule)) : [];
    }

    get lateScheduleIds(): Array<number>{
        return this.lateSchedule ? this.StringToNumber(Object.keys(this.lateSchedule)) : [];
    }

    get longQueueIds(): Array<number>{
        return this.longQueue ? this.StringToNumber(Object.keys(this.longQueue)) : [];
    }

    get longRunningIds(): Array<number>{
        return this.longRunning ? this.StringToNumber(Object.keys(this.longRunning)) : [];
    }

	get unknowCount(): number {
		return this.unknow ? this.StringToNumber(Object.keys(this.unknow)).length : 0;
	}
	get triageCount(): number {
		return this.triage ? this.StringToNumber(Object.keys(this.triage)).length : 0;
	}
	get errorCount(): number {
		return this.error ? this.StringToNumber(Object.keys(this.error)).length : 0;
	}
	get noScheduleCount(): number {
		return this.noSchedule ? this.StringToNumber(Object.keys(this.noSchedule)).length : 0;
	}
	get lateScheduleCount(): number {
		return this.lateSchedule ? this.StringToNumber(Object.keys(this.lateSchedule)).length : 0;
	}
	get longQueueCount(): number {
		return this.longQueue ? this.StringToNumber(Object.keys(this.longQueue)).length : 0;
	}
	get longRunningCount(): number {
		return this.longRunning ? this.StringToNumber(Object.keys(this.longRunning)).length : 0;
    }
    
    StringToNumber(arr: Array<string>) {
        let ids = new Array<number>();
        arr.forEach(t => ids.push(Number(t)));
        return ids;
    }

	get allIds(): Array<number> {

		let allIds = new Array<number>();
		if (this.unknow) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.unknow)));
		}
		if (this.triage) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.triage)));
		}
		if (this.error) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.error)));
		}
		if (this.noSchedule) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.noSchedule)));
		}
		if (this.lateSchedule) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.lateSchedule)));
		}
		if (this.longQueue) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.longQueue)));
		}
		if (this.longRunning) {
			allIds = allIds.concat(this.StringToNumber(Object.keys(this.longRunning)));
		}
		return allIds.distinct();
	}
}

export class ErrorSummary {
	constructor(
		public errorViewCount?: number,
		public errorTimes?: number,
		public everyVersion?: ErrorFacet,
		public majorVersion?: ErrorFacet,
		public manual?: ErrorFacet
	) {}

	get allErrorViewIds(): Array<number> {
		let allErrorViewIds = new Array<number>();
		allErrorViewIds = this.everyVersion.erroredIds
			.concat(this.majorVersion.erroredIds)
			.concat(this.manual.erroredIds);
		return allErrorViewIds.distinct();
    }
    
    currentErrorTimesPercent(errorSummary:ErrorSummary,triageReportSummary:TriageReportSummary){
        return Number(((errorSummary.errorTimes / triageReportSummary.allRefreshTimes) * 100).toFixed(2));
    }
}

export class ErrorFacet {
	constructor(
        public errorTimes?: number, 
        public erroredIds?: Array<number>, 
        public stateCount?: number
    ) {}

	get errorViewsPercent(): number {
		return Number(((this.erroredIds.length / this.stateCount) * 100).toFixed(2));
    }
    
    errorEveryVersionPercent(errorFacet:ErrorFacet,triageReportSummary:TriageReportSummary){
        return Number(((errorFacet.errorTimes / triageReportSummary.everyVersionRefreshtimes) * 100).toFixed(2));
    }

    errorMajorVersionPercent(errorFacet:ErrorFacet,triageReportSummary:TriageReportSummary){
        return Number(((errorFacet.errorTimes / triageReportSummary.majorVersionRefreshtimes) * 100).toFixed(2));
    }

    errorManualPercent(errorFacet:ErrorFacet,triageReportSummary:TriageReportSummary){
        return Number(((errorFacet.errorTimes / triageReportSummary.manualRefreshtimes) * 100).toFixed(2));
    }
}

export class LongLatencySummary {
    constructor(
        public everyVersion?: Array<number>,
        public majorVersion?: Array<number>,
        public manual?: Array<number>
    ) { }

    longLatencyEveryVersionPercent(missSlaFacet:MissSlaFacet){
        return Number(((this.everyVersion.length / missSlaFacet.stateCount) * 100).toFixed(2));
    }

    longLatencyMajorVersionPercent(missSlaFacet:MissSlaFacet){
        return Number(((this.majorVersion.length / missSlaFacet.stateCount) * 100).toFixed(2));
    }

    longLatencyManualPercent(missSlaFacet:MissSlaFacet){
        return Number(((this.manual.length / missSlaFacet.stateCount) * 100).toFixed(2));
    }
}

export class TriageSummary {
	constructor(
		public triageViewCount?: number,
		public triageTimes?: number,
		public everyVersion?: TriageFacet,
		public majorVersion?: TriageFacet,
		public manual?: TriageFacet
	) {}

	get allTriageViewIds(): Array<number> {
		let allTriageViewIds = new Array<number>();
		allTriageViewIds = this.everyVersion.allViewIds
			.concat(this.majorVersion.allViewIds)
			.concat(this.manual.allViewIds);
		return allTriageViewIds.distinct();
    }
    
    currentTriagedTimesPercent(triageSummary:TriageSummary,triageReportSummary:TriageReportSummary){
        return Number(((triageSummary.triageTimes / triageReportSummary.allRefreshTimes) * 100).toFixed(2));
    }
}

export class TriageFacet {
	constructor(
		public aveCommitLatency?: number,
		public commitedIds?: Array<number>,
		public stateCount?: number,
		public triageTimes?: number,
		public uncommitedIds?: Array<number>
	) {}

	get aveLatency(): number {
		return Number(this.aveCommitLatency.toFixed(2));
	}

	get allViewIds(): Array<number> {
		let allViewIds = new Array<number>();
		allViewIds = this.commitedIds.concat(this.uncommitedIds);
		return allViewIds.distinct();
	}

	get triageViewsPercent(): number {
		return Number(((this.allViewIds.length / this.stateCount) * 100).toFixed(2));
    }

    triageEveryVersionPercent(triageFacet:TriageFacet,triageReportSummary:TriageReportSummary){
        return Number(((triageFacet.triageTimes / triageReportSummary.everyVersionRefreshtimes) * 100).toFixed(2));
    }

    triageMajorVersionPercent(triageFacet:TriageFacet,triageReportSummary:TriageReportSummary){
        return Number(((triageFacet.triageTimes / triageReportSummary.majorVersionRefreshtimes) * 100).toFixed(2));
    }

    triageManualPercent(triageFacet:TriageFacet,triageReportSummary:TriageReportSummary){
        return Number(((triageFacet.triageTimes / triageReportSummary.manualRefreshtimes) * 100).toFixed(2));
    }
}

export class RankSummary {
	constructor(
		public versionLatencyRank?: VersionLatencyRank,
		public ownerRanks?: Array<AttributeRank>,
		public segmentRanks?: Array<AttributeRank>,
		public viewNameRanks?: Array<ViewNameRank>
	) {
		this.versionLatencyRank = new VersionLatencyRank();
		this.segmentRanks = new Array<AttributeRank>();
		this.ownerRanks = new Array<AttributeRank>();
		this.viewNameRanks = new Array<ViewNameRank>();
	}
}

export class VersionLatencyRank {
	constructor(
		public zeroToFifty?: LatencyRankFacet,
		public fiftyToNinety?: LatencyRankFacet,
		public ninetyToHundred?: LatencyRankFacet
	) {
		this.zeroToFifty = new LatencyRankFacet();
		this.fiftyToNinety = new LatencyRankFacet();
		this.ninetyToHundred = new LatencyRankFacet();
	}
}

export class LatencyRankFacet {
	constructor(
		public maxLatency?: number,
		public minLatency?: number,
		public aveLatency?: number,
		public ids?: Array<number>
	) {}
	get aveLatencyRank(): number {
		return Number(this.aveLatency.toFixed(2));
	}
}

export class AttributeRank {
	constructor(
		public attribute?: string,
		public erroredViewsIds?: Array<number>,
		public missSlaViewsIds?: Array<number>,
		public triagedViewsIds?: Array<number>
	) {
		this.missSlaViewsIds = new Array<number>();
		this.triagedViewsIds = new Array<number>();
		this.erroredViewsIds = new Array<number>();
	}
}

export class ViewNameRank {
	constructor(
		public id?: number,
		public viewName?: string,
		public missSlaTimes?: number,
		public triagedTimes?: number,
		public erroredTimes?: number
	) {}
}

export class TriageReportDetail {
	constructor(
		public id?: number,
		public allVersions?: Array<ViewVersionLatency>,
		public averageLatency?: string,
		public minLatency?: string,
		public maxLatency?: string,
		public ninetyLatency?: string,
		public owner?: string,
		public refreshedTimes?: number,
		public segment?: string,
		public viewName?: string,
		public currentState?: string,
		public viewState?: string,
		public customerId?: string,
		public customerEnv?: string,
        public entitySpaceName?: string,
        public latestVersionLatency?: number,
        public latestSucceedVersionLatency?: number
	) {
		this.allVersions = new Array<ViewVersionLatency>();
	}
}

export class ViewVersionMetric {
    constructor(
        public everyVersionViewCount?: number,
        public everyVersionVersionCount?: number,
        public majorVersionViewCount?: number,
        public majorVersionVersionCount?: number,
        public manualViewCount?: number,
        public manualVersionCount?: number,
        public everyVersion?: Array<DailyViewVersionMetric>,
        public majorVersion?: Array<DailyViewVersionMetric>,
        public manual?: Array<DailyViewVersionMetric>,
    ) { }
}

export class DailyViewVersionMetric {
    constructor(
        public shortDate?: string,
        public viewCount?: number,
        public versionCount?: number,
        public missSlaDaliyMetricFacet?: MetricFacet,
        public triageDaliyMetricFacet?: MetricFacet,
        public errorDaliyMetricFacet?: MetricFacet,
    ) { }
}

export class MetricFacet {
    constructor(
        public viewIds?: Array<number>,
        public viewCount?: number,
        public idToVersions?: any,
        public versionCount?: number
    ) { }
}