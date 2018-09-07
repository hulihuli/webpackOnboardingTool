import { Component, OnInit } from "@angular/core";
import {
    HttpClient,
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpParams,
    HttpHeaders,
    HttpResponse
} from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { saveAs } from "file-saver";
import { Observable } from "rxjs/Rx";

import { EntityView, Functoid, EntityViewVersion, MappingFile } from "../../../core/common/entityView";
import { BaseComponent } from "../../common/base.component";
import { TriageService } from "../triage.service";
import { AetherJob } from "../../../core/job/AetherJob";
import {
    TriageAnalysisDto,
    TriageAnalysis,
    DebugInfo,
    Revision,
    TriageDebugInfoTable,
    PropertyInfo,
    AddedAndDeletedPair
} from "../../../core/triage/triageAnalysis";
import {
    EntityComparison,
    PropertyComparison,
    ValueComparison,
    TriageChurn,
    TriageLayer,
    TriageAnalysisResult,
    TriageAnalysisResultCount,
    DebugStreamExistense,
    ChurnCount,
    PropertyTriageChurn
} from "../../../core/triage/tirageAnlaysisResult";
import { forEach } from "@angular/router/src/utils/collection";
import { Subscription } from "rxjs/Subscription";
import { JobState, JobPanelState } from "../../../core/job/job";
import { JobPanelComponent } from "../../../templates/jobPanel/jobPanel.component";
import { SatoriDateTime } from "../../../helper/satoriDatetime";

import { NgxAlertsService } from "@ngx-plus/ngx-alerts";
import { AlertMsg } from "../../../core/plugin/ngAlert";
import swal from "sweetalert2";
import { constants } from "http2";
import { Constants } from "../../../core/common/constants";
import { TriageAnalysisResultDiaplayType } from "../../../core/enums";

@Component({
    selector: "triage",
    templateUrl: "./triageAnalysis.component.html",
    styleUrls: ["./triageAnalysis.component.css"]
})
export class TriageAnalysisComponent extends BaseComponent implements OnInit {
    customerIdEnvironment: string; // = "WrapStar-Prod";
    entityViewKey: string; // = "WrapStar-Full_WrapStar_Redfin";
    entityView: EntityView;
    customerId: string;
    customerEnv: string;
    entitySpaceName: string;
    entitySpaceViewName: string;
    side2Type: string; // = "Triage";
    triageAnalysis: TriageAnalysis;
    currentSide1: EntityViewVersion;
    currentSide2: EntityViewVersion;
    isFetchingEntityView: boolean;
    side1VersionNums: string[];
    side2VersionNums: string[];
    debugInfo: DebugInfo;
    currentSide1Models: Array<Revision>;
    currentSide2Models: Array<Revision>;
    isFetchingAnalysisResult: boolean;

    //job
    triageAnalysisAetherJob: AetherJob; //Observable<AetherJob>;
    triageAnalysisResultId: number;
    jobPanelState: JobPanelState;
    isForceSubmission: boolean;
    //regular timer
    timer: Observable<number>;
    timerSubscription: Subscription;

    //analysis reuslt
    triageAnalysisResultCount: TriageAnalysisResultCount;
    currentTriageResultCount: ChurnCount;
    triageDebugStream: string;
    currentChurn: TriageChurn;
    triageAnalysisResult: TriageAnalysisResult;
    entityViewerSide1: string;
    entityViewerSide2: string;
    isDebugInfoPane: boolean;
    isFetchingExtraProperties: boolean;
    extraPropertyInfos: Array<PropertyInfo>;
    sideBySidePropertyInfos: Array<PropertyInfo>;
    isFetchingSidebySideProperties: boolean;
    //sideBySidePairs: Array<AddedAndDeletedPair>;
    isFetchingSidebySideairs: boolean;

    //triageViewCommit
    commitComment: string;
    previousCommit: string;
    commitTips: Array<string>;
    isCheckedCommitTip: boolean;
    isCommitingTriagedView: boolean;

    //entitySpaceStreamPath
    standardEpRelativeStreamPath: string;
    triageEpRelativeStreamPath: string;
    modelIdsArr: Array<string>;
    modelIdStr: string;

    //function params to directive
    submitTriageJobFunc: Function;
    getTriageJobFunc: Function;
    cancelTriageJobFunc: Function;

    constructor(
        private triageService: TriageService,
        private route: ActivatedRoute,
        private location: Location,
        private alerts: NgxAlertsService
    ) {
        super();
    }

    ngOnInit() {
        this.triageAnalysisResultId = -1;
        this.isFetchingEntityView = false;
        this.isDebugInfoPane = true;
        this.side2Type = "Triage";
        this.customerIdEnvironment = "WrapStar-Prod";
        this.entityViewKey = "WrapStar-Full_wrapstar_education_redfin";
        this.debugInfo = new DebugInfo();
        this.currentSide1Models = new Array<Revision>();
        this.currentSide2Models = new Array<Revision>();
        this.timer = Observable.timer(0, 30000);

        this.commitTips = Array.from(Constants.commitCommentTips.keys());
        this.isCheckedCommitTip = false;
        this.isCommitingTriagedView = false;
        this.commitComment = Constants.commitCommentTips.get("SourceChange");
        this.previousCommit = "";

        let customerEnv = this.route.snapshot.paramMap.get("customerEnv");
        let viewKey = this.route.snapshot.paramMap.get("viewKey");
        this.logger.info(customerEnv, viewKey);
        if (customerEnv && viewKey) {
            this.customerIdEnvironment = customerEnv;
            this.entityViewKey = viewKey;
            this.loadTriageAnalysis();
        }

        this.initializeMembers();
        //function param
        this.submitTriageJobFunc = () => this.submitTriageJob();
        this.getTriageJobFunc = (jobId: number) => this.getTriageAnalysisJob(jobId);
        this.cancelTriageJobFunc = () => this.cancelTriageJob();
    }

    initializeMembers() {
        this.entityView = new EntityView();
        this.triageAnalysis = new TriageAnalysis();
        this.currentSide1 = new EntityViewVersion();
        this.currentSide2 = new EntityViewVersion();
        this.side1VersionNums = new Array<string>();
        this.side2VersionNums = new Array<string>();
        this.triageAnalysisResultCount = new TriageAnalysisResultCount();
        this.currentTriageResultCount = new ChurnCount();
        //this.triageDebugStream = "ValueChurnCounter"; //"PipelineTopEntitiesChurnCounter";
        this.isForceSubmission = false;
        this.resetJobAndResults();
    }

    resetJobAndResults() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        this.currentChurn = new TriageChurn();
        this.triageAnalysisResult = new TriageAnalysisResult();
        this.triageAnalysisAetherJob = new AetherJob();
        this.jobPanelState = new JobPanelState();
    }

    loadTriageAnalysis(isForceRefresh: boolean = false) {
        this.initializeMembers();
        this.isFetchingEntityView = true;
        this.parseEntitySpaceViewMeta();
        this.getEntityView(isForceRefresh);
    }

    selectCommitTip(commmitTip: string, event: any) {
        if (this.isCheckedCommitTip || this.previousCommit !== commmitTip) {
            this.commitComment = Constants.commitCommentTips.get(commmitTip);
            this.previousCommit = commmitTip;
            this.isCheckedCommitTip = false;
            $(event.target).removeClass("checked");
        } else {
            this.commitComment = "";
            this.isCheckedCommitTip = true;
            $(event.target).addClass("checked");
        }
    }

    commitView() {
        swal({
            title: "Are you sure to commit this view?",
            text: "You won't be able to revert this !",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, commit it !"
        }).then(result => {
            if (result.value) {
                this.isCommitingTriagedView = true;
                this.triageService
                    .commitTriagedView(
                        this.customerId,
                        this.customerEnv,
                        this.entitySpaceName,
                        this.entitySpaceViewName,
                        this.commitComment
                    )
                    .subscribe(commitResult => {
                        this.logger.info("commit result", commitResult);
                        swal({
                            title: "Commit !",
                            text: "The view has been commit :)",
                            type: "success",
                            timer: 1300
                        }).then(r => {
                            this.isCommitingTriagedView = false;
                            this.loadTriageAnalysis(true);
                        });
                    });
            }
        });
    }

    parseEntitySpaceViewMeta() {
        let params = this.customerIdEnvironment.split("-");
        let len = params.length;
        if (len >= 2) {
            this.customerId = params[0];
            this.customerEnv = params[1];
            let underLineCount = this.entityViewKey.match(/_/g).length;
            let pos = this.entityViewKey.indexOf("_");
            this.entitySpaceName = this.entityViewKey.substr(0, pos);
            this.entitySpaceViewName = this.entityViewKey.substr(pos + 1);
            let specificEntityViewKey = Constants.specificViewsWithUnderline.get(this.entityViewKey);
            if (underLineCount >= 2 && specificEntityViewKey) {
                this.entitySpaceName = specificEntityViewKey.entitySpace;
                this.entitySpaceViewName = specificEntityViewKey.entitySpaceView;
            }

            this.entityView = new EntityView(
                this.entityViewKey,
                this.customerId,
                this.customerEnv,
                this.entitySpaceName,
                this.entitySpaceViewName
            );
        }
        this.logger.info("parseEntitySpaceViewMeta", this.entityView);
    }

    getEntityView(isForceRefresh: boolean = false) {
        this.entityView = new EntityView();
        return (
            this.triageService
                .getEntityView(this.customerId, this.customerEnv, this.entityViewKey, isForceRefresh)
                // .finally(() => {
                // 	this.isFetchingEntityView = false;
                // 	this.logger.info("finally");
                // })
                .subscribe(
                    entityView => {
                        this.entityView = entityView;

                        this.initSide1Version();
                        this.initSide2Version();

                        this.debugInfo = entityView.debugInfo;
                        this.logger.info("entityView", entityView);

                        this.getTriageAnalysis(
                            this.customerId,
                            this.customerEnv,
                            this.entityViewKey,
                            this.currentSide1.version,
                            this.currentSide2.version
                        );
                        this.isFetchingEntityView = false;
                    },
                    err => {
                        this.isFetchingEntityView = false;
                        this.logger.info("err", err);
                    }
                )
        );
    }

    getWrapStarModelDetail() {
        this.modelIdsArr = new Array<string>();
        let side1MappingFileNames = this.currentSide1.mappingSetting.mappingFiles.map(t => t.name);
        this.currentSide1.mappingSetting.mappingFiles.forEach(t => {
            this.triageService
                .getWrapstarModelVersion(
                    this.customerId,
                    this.customerEnv,
                    this.entityViewKey,
                    this.currentSide1.version,
                    t.name
                )
                .subscribe(modelRevisions => {
                    this.logger.info("currentSide1", JSON.stringify(modelRevisions));
                    t.modelRevisions = new Array<Revision>();
                    modelRevisions.forEach(r => {
                        t.modelRevisions.push(r);
                        this.modelIdsArr.push(r.model);
                        this.modelIdStr = this.modelIdsArr.join(";");
                    });

                    if (this.currentSide2 && this.currentSide2.mappingSetting.mappingFiles) {
                        this.currentSide2.mappingSetting.mappingFiles.forEach(m => {
                            if (t.name === m.name) {
                                //m.modelRevisions = modelRevisions;
                                m.modelRevisions = new Array<Revision>();
                                modelRevisions.forEach(r => {
                                    m.modelRevisions.push(r);
                                });
                            }
                        });
                    }

                    this.logger.info(
                        "this.currentSide2.mappingSetting.mappingFiles",
                        this.currentSide2.mappingSetting.mappingFiles
                    );
                });
        });

        if (this.currentSide2 && this.currentSide2.mappingSetting.mappingFiles) {
            this.currentSide2.mappingSetting.mappingFiles.forEach(t => {
                let mappingFile = this.currentSide1.mappingSetting.mappingFiles.find(m => m.name == t.name);
                if (side1MappingFileNames.indexOf(t.name) === -1) {
                    this.triageService
                        .getWrapstarModelVersion(
                            this.customerId,
                            this.customerEnv,
                            this.entityViewKey,
                            this.currentSide1.version,
                            t.name
                        )
                        .subscribe(modelRevisions => {
                            this.logger.info("currentSide2", JSON.stringify(modelRevisions));
                            t.modelRevisions = new Array<Revision>();
                            modelRevisions.forEach(r => {
                                t.modelRevisions.push(r);
                            });
                        });
                } else {
                    t.modelRevisions = mappingFile.modelRevisions;
                }
            });
        }
    }

    getTriageAnalysis(
        customerId: string,
        customerEnv: string,
        viewKey: string,
        standardVersion: string,
        triagedVersion: string
    ) {
        this.triageService
            .getTriageAnalysis(customerId, customerEnv, viewKey, standardVersion, triagedVersion)
            .subscribe((triageAnalysis: TriageAnalysis) => {
                this.logger.info("triageAnalysis1", triageAnalysis);
                this.triageAnalysis = triageAnalysis;
                this.resetJobAndResults();
                //lihu: need to fix later
                this.standardEpRelativeStreamPath = this.currentSide1.entitySpaceStreamPath.replace(
                    "https://cosmos08.osdinfra.net/cosmos",
                    "/shares"
                );
                this.triageEpRelativeStreamPath = this.currentSide2.entitySpaceStreamPath.replace(
                    "https://cosmos08.osdinfra.net/cosmos",
                    "/shares"
                );
                if (triageAnalysis) {
                    //this.debugInfo = triageAnalysis.debugInfo;
                    this.triageAnalysisResultId = triageAnalysis.resultId;
                    this.logger.info("triageAnalysis", triageAnalysis);
                    this.logger.info("entityView", this.entityView);
                    this.logger.info("side1", this.currentSide1);
                    this.logger.info("side2", this.currentSide2);
                    this.logger.info("debugInfo", this.debugInfo);
                    if (triageAnalysis.analysisJobId != -1) {
                        this.setJobStateTimer(triageAnalysis.analysisJobId);
                    }
                }
            });
    }

    initSide1Version(index: number = 0) {
        if (this.entityView.standardVersions.length > 0) {
            this.currentSide1 = this.entityView.standardVersions[0];
            if (index != 0) {
                this.currentSide1 = this.entityView.standardVersions[index];
            }
            this.side1VersionNums = this.entityView.standardVersions.map(t => t.version);
        }
    }

    initSide2Version() {
        this.currentSide2 = new EntityViewVersion();
        if (this.side2Type == "Triage") {
            this.side2VersionNums = this.entityView.triagedVersions.map(t => t.version);
            let len = this.side2VersionNums.length;

            this.initSide1Version();
            if (len > 0) {
                this.currentSide2 = this.entityView.triagedVersions[0];
                this.setSide2ViewVersionNum(this.side2VersionNums[0]);
            } else {
                this.resetJobAndResults();
            }
        } else {
            this.side2VersionNums = this.side1VersionNums;
            let len = this.side2VersionNums.length;

            this.initSide1Version(1);
            if (len > 0) {
                this.currentSide2 = this.entityView.standardVersions[0];
                this.setSide2ViewVersionNum(this.side2VersionNums[0]);
            } else {
                this.resetJobAndResults();
            }
        }
    }

    getVersionSplitNumSum(version: string): number {
        var splitedVersionStrings = version.split(".");
        var splitedVersionNumbers = splitedVersionStrings.map(Number);
        var splitedVersionNumSum = splitedVersionNumbers.reduce((total: number, num: number) => {
            return total * 10 + num;
        });
        return splitedVersionNumSum;
    }

    validateVersionNum(side1Version: string, side2Version: string) {
        var side1Sum = this.getVersionSplitNumSum(side1Version);
        var side2Sum = this.getVersionSplitNumSum(side2Version);
        if (side1Sum > side2Sum) {
            return false;
        } else {
            return true;
        }
    }

    setSide1ViewVersionNum(version: string) {
        this.currentSide1 = this.entityView.standardVersions.find(t => t.version == version);
        //add check
        if (this.validateVersionNum(this.currentSide1.version, this.currentSide2.version)) {
            this.getTriageAnalysis(
                this.customerId,
                this.customerEnv,
                this.entityViewKey,
                this.currentSide1.version,
                this.currentSide2.version
            );
        }
    }

    setSide2ViewVersionNum(version: string) {
        if (this.side2Type == "Triage") {
            this.currentSide2 = this.entityView.triagedVersions.find(t => t.version == version);
        } else {
            this.currentSide2 = this.entityView.standardVersions.find(t => t.version == version);
        }
        if (this.validateVersionNum(this.currentSide1.version, this.currentSide2.version)) {
            this.getTriageAnalysis(
                this.customerId,
                this.customerEnv,
                this.entityViewKey,
                this.currentSide1.version,
                this.currentSide2.version
            );
            if (this.customerId === Constants.wrapStar) {
                this.getWrapStarModelDetail();
            }
        }
    }

    //#region download artifact
    downloadFunctoid(dotSplitedVersionNum: string, functoid: Functoid) {
        functoid.isDownloading = true;
        this.triageService
            .downloadFunctoid(
                this.customerId,
                this.customerEnv,
                this.entityViewKey,
                dotSplitedVersionNum,
                functoid.name
            )
            .subscribe((response: HttpResponse<any>) => {
                const functoidName: string = response.headers.get("filename");
                const blob = new Blob([response.body], {
                    type: "application/octet-binary,charset=utf-8"
                });
                saveAs(blob, functoid.name);
                functoid.isDownloading = false;
            });
    }

    downloadMappingFile(dotSplitedVersionNum: string, mappingFile: MappingFile) {
        mappingFile.isDownloading = true;
        this.triageService
            .downloadMappingFile(
                this.customerId,
                this.customerEnv,
                this.entityViewKey,
                dotSplitedVersionNum,
                mappingFile.name
            )
            .subscribe((response: HttpResponse<any>) => {
                const mappingFileName: string = response.headers.get("filename");
                const blob = new Blob([response.body], {
                    type: "application/xml,charset=utf-8"
                });
                saveAs(blob, `${mappingFileName}@${mappingFile.version}.xml`);
                mappingFile.isDownloading = false;
            });
    }

    downloadWrapstarModel(modelRevision: Revision) {
        modelRevision.isDownloading = true;
        this.triageService
            .downloadWrapstarModel(modelRevision.model, modelRevision.version)
            .subscribe((response: HttpResponse<any>) => {
                const wrapstarModelName: string = response.headers.get("filename");
                this.logger.info("response", response);
                const blob = new Blob([response.body], {
                    type: "application/xml,charset=utf-8"
                });
                saveAs(blob, `WrapstarModel@${modelRevision.version}.xml`);
                modelRevision.isDownloading = false;
            });
    }
    //#endregion

    //region job related
    submitTriageJob() {
        this.logger.info("side1", this.currentSide1.version);
        this.logger.info("side2", this.currentSide2.version);
        if (
            this.currentSide1.version &&
            this.currentSide2.version &&
            !this.validateVersionNum(this.currentSide1.version, this.currentSide2.version)
        ) {
            swal(new AlertMsg("Wrong!", "error", "The standard version should earlier than triage version!", 3000));
            return;
        }

        this.logger.info("Submit triage job");
        let triageAnalysisDto = new TriageAnalysisDto(
            this.customerId,
            this.customerEnv,
            this.entitySpaceName,
            this.entitySpaceViewName,
            this.currentSide2.relativeDebugStreamFolder,
            this.currentSide1.version,
            this.currentSide2.version,
            this.currentSide1.relativeStreamPath,
            this.currentSide2.relativeStreamPath
        );

        this.jobPanelState.isSubmiting = true;

        this.triageService
            .submitTriageAnalysisJob(
                this.isForceSubmission,
                this.triageAnalysisAetherJob.virtualCluster,
                this.triageAnalysisAetherJob.cloudPriority,
                triageAnalysisDto
            )
            .subscribe((aetherJob: AetherJob) => {
                this.logger.info("aetherJobsubmit", aetherJob);
                this.triageAnalysisAetherJob = aetherJob;
                this.currentChurn = new TriageChurn();
                this.setJobPanelState(aetherJob.state);
                this.setJobStateTimer(aetherJob.id);
            });
    }

    setJobStateTimer(jobId: number) {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        this.logger.info("timer start");
        this.timerSubscription = this.timer
            .takeWhile(
                () =>
                    this.triageAnalysisAetherJob.state === JobState.Waiting ||
                    this.triageAnalysisAetherJob.state === JobState.Queued ||
                    this.triageAnalysisAetherJob.state === JobState.Running
            )
            .subscribe(t => {
                this.getTriageAnalysisJob(jobId);
            });
    }

    getTriageAnalysisJob(jobId: number) {
        this.triageService.getTriageAnalysisJob(jobId).subscribe((aetherJob: AetherJob) => {
            this.logger.info("aether job:", aetherJob);
            // this.cloudPriority = aetherJob.cloudPriority;
            // this.virtualCluster = aetherJob.virtualCluster;
            this.triageAnalysisAetherJob = aetherJob;
            this.triageAnalysisResultId = aetherJob.resultId;
            this.setJobPanelState(aetherJob.state);

            //get analysis results
            // if (aetherJob.state === JobState.Succeeded) {
            // 	this.getTriageAnalysisResultCount(this.triageAnalysisResultId);
            // }
        });
        this.logger.info("Get triage job");
    }

    setJobPanelState(jobState: JobState) {
        switch (jobState) {
            case JobState.Waiting:
            case JobState.Queued:
            case JobState.Running: {
                this.jobPanelState.isRunning = true;
                this.jobPanelState.isCanceling = false;
                this.jobPanelState.isSubmiting = false;
                break;
            }
            case JobState.Failed:
            case JobState.Canceled:
            case JobState.TimeOut:
            case JobState.UnKnown:
            case JobState.Succeeded: {
                this.jobPanelState.isCanceling = false;
                this.jobPanelState.isSubmiting = false;
                this.jobPanelState.isRunning = false;
                break;
            }
        }
        this.logger.info("jobPanelState", this.jobPanelState);
    }

    cancelTriageJob() {
        this.jobPanelState.isCanceling = true;

        this.logger.info("Cancel triage job");
        if (this.triageAnalysisAetherJob.id !== -1) {
            this.triageService.cancelTriageAnalysisJob(this.triageAnalysisAetherJob.id).subscribe(aetherJob => {
                this.jobPanelState.isCanceling = false;
                this.jobPanelState.isRunning = false;
                this.triageAnalysisAetherJob = aetherJob;
                this.timerSubscription.unsubscribe();
                this.logger.info("cancel", aetherJob);
            });
        }
    }
    //#endregion

    //#region triage analysis result related
    //to combine table rows to group triples by subject or property
    setCollapseTag(churn: TriageChurn) {
        this.setEntityComparisonCollapseTag(churn.deleted.entity);
        this.setEntityComparisonCollapseTag(churn.added.entity);
        this.setPropertyComparisonCollapseTag(churn.deleted.property);
        this.setPropertyComparisonCollapseTag(churn.added.property);
    }

    setEntityComparisonCollapseTag(triageLayer: Array<EntityComparison>) {
        //this.logger.info("triageLayer", triageLayer);
        if (triageLayer.length !== 0) {
            triageLayer.forEach(t => {
                //this.logger.info("subjectValueComparisons", t.subjectValueComparisons);
                if (t.propertyValueComparisons && t.propertyValueComparisons.length !== 0) {
                    //this.logger.info(t.property);
                    t.propertyValueComparisons[0].isFirst = true;
                }
            });
        }
    }

    setPropertyComparisonCollapseTag(triageLayer: Array<PropertyComparison>) {
        //this.logger.info("triageLayerProperty", triageLayer);
        if (triageLayer.length !== 0) {
            triageLayer.forEach(t => {
                //this.logger.info("subjectValueComparisons", t.subjectValueComparisons);
                if (t.subjectValueComparisons && t.subjectValueComparisons.length !== 0) {
                    //this.logger.info(t.property);
                    t.subjectValueComparisons[0].isFirst = true;
                }
            });
        }
    }

    getTriageAnalysisResultByProperty(
        propertyInfo: any,
        debugStream: string,
        resultType: TriageAnalysisResultDiaplayType
    ) {
        this.logger.info("before", propertyInfo, this.triageAnalysisResultId);
        if (this.triageAnalysisResultId === -1) {
            swal({
                text: "Sorry, triage analysis job is still running!",
                type: "warning",
                timer: 2000,
                cancelButtonColor: "OK",
            });
            return;
        }
        if (!propertyInfo.expandDetail) {
            this.collapseAllPropertyResult(resultType);
        }
        propertyInfo.expandDetail = !propertyInfo.expandDetail;
        if (propertyInfo.expandDetail && this.isDebugInfoPane && !propertyInfo.triageChurn) {
            this.triageService
                .getTriageResultByProperty(this.triageAnalysisResultId, propertyInfo.predicate, debugStream)
                .map(t => {
                    //convert satori time
                    this.convertSatoriTimeToGeneralTime(t.triageChurn);
                    return t;
                })
                .subscribe((propertyTriageChurn: PropertyTriageChurn) => {
                    this.setCollapseTag(propertyTriageChurn.triageChurn);
                    propertyInfo.churnCount = propertyTriageChurn.churnCount;
                    propertyInfo.triageChurn = propertyTriageChurn.triageChurn;
                    this.logger.info("after", propertyInfo);
                });
        }
    }

    getExtraProperties() {
        if (!this.extraPropertyInfos && this.triageAnalysisResultId != -1) {
            this.isFetchingExtraProperties = true;
            this.triageService
                .getExtraProperties(this.triageAnalysis.id, this.triageAnalysisResultId)
                .subscribe((properties: Array<string>) => {
                    this.isFetchingExtraProperties = false;
                    this.extraPropertyInfos = properties.map(p => new PropertyInfo(p));
                    this.logger.info("extraPropertyInfos", this.extraPropertyInfos);
                });
        }
    }

    getSideBySideProperties() {
        if (!this.sideBySidePropertyInfos && this.triageAnalysisResultId != -1) {
            this.isFetchingSidebySideProperties = true;
            this.triageService
                .getSideBySideProperties(this.triageAnalysisResultId)
                .subscribe((properties: Array<string>) => {
                    this.sideBySidePropertyInfos = properties.map(p => new PropertyInfo(p));
                    this.isFetchingSidebySideProperties = false;
                });
        }
    }

    getSideBySidePairsByProperty(propertyInfo: PropertyInfo, resultType: TriageAnalysisResultDiaplayType) {
        if (!propertyInfo.expandDetail) {
            this.collapseAllPropertyResult(resultType);
        }
        propertyInfo.expandDetail = !propertyInfo.expandDetail;
        if (!propertyInfo.sideBySidePairs && !this.isFetchingSidebySideairs) {
            this.isFetchingSidebySideairs = true;
            this.triageService
                .getSideBySidePairsByProperty(this.triageAnalysisResultId, propertyInfo.predicate)
                .subscribe((sideBySidePairs: Array<AddedAndDeletedPair>) => {
                    propertyInfo.sideBySidePairs = sideBySidePairs;
                    this.isFetchingSidebySideairs = false;
                });
        }
    }

    collapseAllPropertyResult(resultType: TriageAnalysisResultDiaplayType) {
        switch (resultType) {
            case TriageAnalysisResultDiaplayType.DebugInfo:
                this.debugInfo.triageDebugInfoFiveColTables.forEach(t =>
                    t.debugInfoFiveCols.forEach(c => (c.expandDetail = false))
                );
                this.debugInfo.triageDebugInfoSixColTables.forEach(t =>
                    t.debugInfoSixCols.forEach(c => (c.expandDetail = false))
                );
                break;
            case TriageAnalysisResultDiaplayType.Extra:
                if (this.extraPropertyInfos) {
                    this.extraPropertyInfos.forEach(t => (t.expandDetail = false));
                }
                break;
            case TriageAnalysisResultDiaplayType.SBS:
                if (this.sideBySidePropertyInfos) {
                    this.sideBySidePropertyInfos.forEach(t => (t.expandDetail = false));
                }
                break;
        }
    }

    convertSatoriTimeToGeneralTime(triageChurn: TriageChurn): TriageChurn {
        this.convertTriageLayerSatoriTime(triageChurn.added);
        this.convertTriageLayerSatoriTime(triageChurn.deleted);
        this.convertTriageLayerSatoriTime(triageChurn.churned);

        return triageChurn;
    }

    convertTriageLayerSatoriTime(triageLayer: TriageLayer) {
        triageLayer.entity.forEach(t => {
            t.propertyValueComparisons.forEach(p => {
                p.standardValues.forEach(v => {
                    v.value = this.convertSatoriTime(v.value);
                });
                p.triagedValues.forEach(v => {
                    v.value = this.convertSatoriTime(v.value);
                });
            });
        });

        triageLayer.property.forEach(t => {
            t.subjectValueComparisons.forEach(p => {
                p.standardValues.forEach(v => {
                    v.value = this.convertSatoriTime(v.value);
                });
                p.triagedValues.forEach(v => {
                    v.value = this.convertSatoriTime(v.value);
                });
            });
        });

        triageLayer.value.forEach(t => {
            t.standardValues.forEach(v => {
                v.value = this.convertSatoriTime(v.value);
            });
            t.triagedValues.forEach(v => {
                v.value = this.convertSatoriTime(v.value);
            });
        });
    }

    convertSatoriTime(value: string): string {
        if (value.indexOf('"^^mso:datetime') != -1) {
            let pos = value.indexOf('"^^');
            let satoriTime = value.substr(1, pos - 1);
            let satoriDatetime = new SatoriDateTime(value);
            return value.replace(satoriTime, satoriDatetime.toStringSecond());
        }
        return value;
    }
    //#endregion
}
