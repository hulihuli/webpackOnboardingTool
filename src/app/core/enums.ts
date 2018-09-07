import { TriageAnalysis } from "./triage/triageAnalysis";

export enum AnalysisType {
    EntitySpace = 1,
    EntityView,
    EntityGraph
};

export enum ApiController {
    EntityPlatform = 1,
    TriageAnalysis,
    EntitySpace,
    EntityView,
    EntityGraph
}

export enum RequestAction {
    AllCustomerIds = 1
}

export enum EntitySpaceViewVersionState {
    Inactive,
    BuildPending,
    Building,
    Standard,
    UpdatePending,
    Updating,
    Triaged,
    Cancelled,
    Errored,
    GenerateEncumbrancePending,
    GeneratingEncumbrance
}

export enum EntitySpaceViewState {
    Unknow,
    EveryVersion,
    MajorVersion,
    Manual
}

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error
}

export enum ReportType {
    Customize = 1,
    Weekly,//every week
    Monthly,//every month
    Quarterly,//every season
    SemiAnnual,//every half a year
    Annual//every year
}

export enum TriageMode{
    Deleted = 1,
    Added,
    Churned
}

export enum WebStorageType{
    LocalStorage,//record in local, when browser close up, it still there
    SessionStorage//when browser close up, the storage will be cleared
}

export enum ViewerType{
    Viewer,
    ViewerDiff,
    ViewerDiffOfTwo
}

export enum WorkItemState {
	Unknow,
    New,
    Investigating,
    Queued,
    Active,
    InProgress,
    InProgressAfterHeadPublished,
    NeedsTriage,
    Removed,
    RemovedHeadOnly,
    Resolved,
    Closed
}

export enum TriageAnalysisResultDiaplayType{
    DebugInfo,
    Extra,
    SBS
}

export enum MissSlaType {
    Unknow = 0,
    NoSchedule,
    LateSchedule,
    LongQueue,
    LongRunning,
    Triage,
    Error
}