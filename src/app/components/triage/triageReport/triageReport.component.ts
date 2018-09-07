import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../common/base.component";
import { TriageService } from "../triage.service";
import { Constants } from "../../../core/common/constants";
import { ReportType } from "../../../core/enums";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import {
    TriageReport,
    TriageReportDetail,
    MissSlaSummary,
    TriageSummary,
    ErrorSummary,
    VersionLatencyRank,
    AttributeRank,
    ViewNameRank,
    MissSlaFacet,
    RootCauseFacet,
    TriageFacet,
    LatencyRankFacet,
    ErrorFacet,
    TriageReportSummary,
    ViewVersionMetric,
    DailyViewVersionMetric,
    MetricFacet,
    LongLatencySummary
} from "../../../core/triage/triageReport";
import { TriageViewSupervisor } from "../../../core/triage/triageViewSupervisor";
import { MultiChartData, SingleChartData, LineChart } from "../../../core/plugin/ngxChart";
import * as moment from 'moment';
import { constants } from "os";

@Component({
    selector: "triage-report",
    templateUrl: "./triageReport.component.html",
    styleUrls: ["./triageReport.component.css"]
})
export class TriageReportComponent extends BaseComponent implements OnInit {
    existingRegularReport: boolean;
    existingCustomizedReport: boolean;
    forceGenerate: boolean;
    //top nav bar
    displayType: string;
    reportType: string;
    reportTypes: Array<string>;
    customizeStartDate: any;
    customizeEndDate: any;
    currentStartDate: any;
    currentEndDate: any;
    currentReportTimeSpan: string;
    currentCustomizedReportTimeSpan: string;
    currentRegularReportTimeSpan: string;
    reportTimeSpans: Array<string>;
    isFetchingReport: boolean;
    isUrlParam: boolean;
    currentReport: TriageReport;
    //table data
    everyVersionLimit: number;
    majorVersionLimit: number;
    manualLimit: number;
    triageReportSummary: TriageReportSummary;
    allTriageReportDetails: Array<TriageReportDetail>;
    allTriageViewSupervisors: Array<TriageViewSupervisor>;
    modalTriageViewSupervisors: Array<TriageViewSupervisor>;
    allViewCount: number;
    missSlaSummary: MissSlaSummary;
    triageSummary: TriageSummary;
    errorSummary: ErrorSummary;
    longLatencySummary: LongLatencySummary;
    versionLatencyRank: VersionLatencyRank;
    segmentRanks: Array<AttributeRank>;
    ownerRanks: Array<AttributeRank>;
    viewNameRanks: Array<ViewNameRank>;
    //sort
    segmentRankNameDesc: boolean;
    segmentRankMissSlaDesc: boolean;
    segmentRankTriageDesc: boolean;
    segmentRankErrorDesc: boolean;
    ownerRankNameDesc: boolean;
    ownerRankMissSlaDesc: boolean;
    ownerRankTriageDesc: boolean;
    ownerRankErrorDesc: boolean;
    viewNameRankNameDesc: boolean;
    viewNameRankTriageDesc: boolean;
    viewNameRankErrorDesc: boolean;
    viewNameRankMissSlaDesc: boolean;
    enablePrevCaret: boolean;
    enableNextCaret: boolean;

    viewVersionMetric: ViewVersionMetric;
    viewVersionMetriLineChart: LineChart;
    missSlaPercent: number;
    triagePercent: number;
    errorPercent: number;
    
    constructor(private triageService: TriageService, private route: ActivatedRoute, private location: Location) {
        super();
    }

    ngOnInit() {
        this.existingRegularReport = true;
        this.existingCustomizedReport = false;//when init page, default locate at regular report, so customized report should be null
        this.forceGenerate = false;
        this.isUrlParam = false;
        this.isFetchingReport = false;
        this.displayType = "Regular";
        this.reportType = ReportType[ReportType.Weekly];
        this.reportTypes = Object.keys(ReportType).filter(t => typeof ReportType[t] === "number");
        // this.sortedViews = new Array<SingleChartData>();
        // this.triageViewSupervisors = new Array<TriageViewSupervisor>();
        this.reportTimeSpans = new Array<string>();

        this.everyVersionLimit = Constants.everyVersionLimit;
        this.majorVersionLimit = Constants.majorVersionLimit;
        this.manualLimit = Constants.manualLimit;

        this.currentReport = undefined;//new TriageReport();
        this.allTriageReportDetails = new Array<TriageReportDetail>();
        this.allTriageViewSupervisors = new Array<TriageViewSupervisor>();
        this.modalTriageViewSupervisors = new Array<TriageViewSupervisor>();
        this.missSlaSummary =  new MissSlaSummary();
        this.triageSummary = new TriageSummary();
        this.errorSummary = new ErrorSummary();
        this.longLatencySummary = new LongLatencySummary();
        this.versionLatencyRank = new VersionLatencyRank();
        this.segmentRanks = new Array<AttributeRank>();
        this.ownerRanks = new Array<AttributeRank>();
        this.viewNameRanks = new Array<ViewNameRank>();
        let reportTimeSpan = this.route.snapshot.paramMap.get("reportTimeSpan");
        let displayType = this.route.snapshot.paramMap.get("displayType");

        this.viewVersionMetric = new ViewVersionMetric();
		this.viewVersionMetriLineChart = new LineChart();

        if (reportTimeSpan) {
            this.isUrlParam = true;
            reportTimeSpan = reportTimeSpan.replace(/_/g, "/");
            reportTimeSpan = reportTimeSpan.replace("-", " - ");
            this.logger.info("reportTimeSpanFromUrl", reportTimeSpan);
            this.currentReportTimeSpan = reportTimeSpan;
            if (displayType == "regular") {
                this.displayType = "Regular";
                this.currentRegularReportTimeSpan = reportTimeSpan;
                this.triageService.getTriageReport(this.currentReportTimeSpan, ReportType.Weekly, this.forceGenerate).subscribe(result => {
                    this.reportType = result.type;
                    this.getTriageReportTimeSpansByReportType(this.reportType, reportTimeSpan);
                });
            }
            else if (displayType == "customize") {
                this.displayType = "Customize";
                this.currentCustomizedReportTimeSpan = reportTimeSpan;
                //timespan: month/day/year - month/day/year
                let startTime = reportTimeSpan.split(" - ")[0];//get startTime from timespan
                let startDate = new Date(Number(startTime.split("/")[2]), Number(startTime.split("/")[0]), Number(startTime.split("/")[1]));
                let endTime = reportTimeSpan.split(" - ")[1];//get endTime from timespan
                let endDate = new Date(Number(endTime.split("/")[2]), Number(endTime.split("/")[0]), Number(endTime.split("/")[1]));
                this.customizeStartDate = this.convertToDatePickerDate(startDate);//put startDate into DatePicker
                this.customizeEndDate = this.convertToDatePickerDate(endDate);//put endDate into DatePicker
                this.generateTriageReport(this.currentCustomizedReportTimeSpan, ReportType.Customize);
            }
        } else {
            this.getTriageReportTimeSpansByReportType(this.reportType);
        }
    }

    getTriageReportTimeSpansByReportType(reportType: string, reportTimeSpan?: string) {
        this.triageService.getTriageReportTimeSpansByReportType(reportType).subscribe(result => {
            if (result.length == 0) {
                this.existingRegularReport = false;//if there is no regular timespan, there is no regular report
            }
            this.reportTimeSpans = result.sort((a, b) => {
                return this.compareTimeSpan(a, b);
            });
            if (this.reportTimeSpans.length != 0) {
                //if there is a param form url, generate report of this param
                let initReportTimeSpan = reportTimeSpan == null ? this.reportTimeSpans[0] : reportTimeSpan;
                this.changeReportTimeSpan(initReportTimeSpan);
            }
            else {
                this.enablePrevCaret = false;
                this.enableNextCaret = false;
            }
            this.reportType = reportType;
        });
    }

    compareTimeSpan(timeSpan1: string, timeSpan2: string) {
        let startTime1 = timeSpan1.split(" - ")[0];
        let startTimeArray1 = startTime1.split("/");
        let startTimeNum1 =
            parseInt(startTimeArray1[2]) * 10000 + parseInt(startTimeArray1[0]) * 100 + parseInt(startTimeArray1[1]);
        let startTime2 = timeSpan2.split(" - ")[0];
        let startTimeArray2 = startTime2.split("/");
        let startTimeNum2 =
            parseInt(startTimeArray2[2]) * 10000 + parseInt(startTimeArray2[0]) * 100 + parseInt(startTimeArray2[1]);
        return startTimeNum2 - startTimeNum1;
    }

    getLastSeveraldayReport(daysCount: number) {
        let today = new Date();
        let utcTodayTime = Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
        );
        let pastDayTime = utcTodayTime - Constants.oneDayMilliseconds * daysCount;//get million seconds of these days
        let pastDay = new Date(pastDayTime);//when init as this, the date is late a month than actual value
        pastDay.setUTCMonth(Number(pastDay.getUTCMonth()) + 1);//so, need plus one to month
        this.customizeStartDate = this.convertToDatePickerDate(pastDay);//put start date into DatePickeer
        let yesterdayTime = utcTodayTime - Constants.oneDayMilliseconds * 1;
        let yesterday = new Date(yesterdayTime);
        yesterday.setUTCMonth(Number(yesterday.getUTCMonth()) + 1);
        this.customizeEndDate = this.convertToDatePickerDate(yesterday);
        this.generateCustomizedTriageReport();
    }

    convertToDatePickerDate(day: Date): any {
        let customizeDate = {
            date: {
                year: day.getUTCFullYear(),
                month: day.getUTCMonth(),
                day: day.getUTCDate()
            }
        };
        return customizeDate;
    }

    changeReportTimeSpan(reportTimeSpan: string) {
        let reportTimeSpanIndex = 0;
        this.reportTimeSpans.forEach((t, index) => {
            if (t == reportTimeSpan) {
                reportTimeSpanIndex = index;
            }
        })

        if (this.reportTimeSpans.length == 1) {
            this.enablePrevCaret = false;
            this.enableNextCaret = false;
        }
        else if (reportTimeSpanIndex == 0) {
            this.enablePrevCaret = true;
            this.enableNextCaret = false;
        }
        else if (reportTimeSpanIndex == this.reportTimeSpans.length - 1) {
            this.enablePrevCaret = false;
            this.enableNextCaret = true;
        }
        else {
            this.enablePrevCaret = true;
            this.enableNextCaret = true;
        }

        this.currentReportTimeSpan = reportTimeSpan;
        this.currentRegularReportTimeSpan = this.currentReportTimeSpan;
        this.generateTriageReport(reportTimeSpan, ReportType.Weekly);
        this.logger.info("changeReportTimeSpan", this.currentReportTimeSpan);
    }

    generateCustomizedTriageReport() {
        if (this.customizeStartDate == null || this.customizeEndDate == null) {
            this.existingCustomizedReport = false;
            this.location.replaceState("triage/report");
            return;
        }
        this.isFetchingReport = true;
        //report timespan format: month/day/year
        this.currentStartDate =
            this.customizeStartDate.date.month +
            "/" +
            this.customizeStartDate.date.day +
            "/" +
            this.customizeStartDate.date.year;
        this.currentEndDate =
            this.customizeEndDate.date.month +
            "/" +
            this.customizeEndDate.date.day +
            "/" +
            this.customizeEndDate.date.year;
        this.currentCustomizedReportTimeSpan = this.currentStartDate + " - " + this.currentEndDate;
        this.currentReportTimeSpan = this.currentCustomizedReportTimeSpan;
        this.generateTriageReport(this.currentReportTimeSpan, ReportType.Customize);
    }

    generateRegularTriageReport() {
        if (this.currentRegularReportTimeSpan == null) {
            this.getTriageReportTimeSpansByReportType(ReportType[ReportType.Weekly]);
        }
        else {
            this.currentReportTimeSpan = this.currentRegularReportTimeSpan;
            this.generateTriageReport(this.currentReportTimeSpan, ReportType.Weekly);
        }
    }

    generateTriageReport(reportTimeSpan: string, type: ReportType) {
        this.triageService.getTriageReport(reportTimeSpan, type, this.forceGenerate).subscribe(result => {
            this.existingCustomizedReport = true;
            if (result.triageReportDetails.forEach(t => t.allVersions.length == 0)) {
                this.existingCustomizedReport = false;
            }
            this.initTables(result);
            this.isFetchingReport = false;
            this.changeUrl();
            this.currentStartDate = result.startDate;
            this.currentEndDate = result.endDate;
            this.logger.info("current report", result);
        });

        let startTime = reportTimeSpan.split("-")[0].trim();
        let endTime = reportTimeSpan.split("-")[1].trim();
        this.triageService.getViewVersionMetric(startTime, endTime).subscribe(result => {
            this.viewVersionMetric = result;
            this.getViewVersionMetricLineChart(result.everyVersion, result.everyVersionViewCount);
        })

        this.logger.info("generateTriageReport", this.currentReportTimeSpan);
    }

    changeUrl() {
        this.isUrlParam = true;
        //change the url without redirction
        if (this.isUrlParam) {
            let urlReportTimeSpan = this.currentReportTimeSpan.replace(new RegExp("/", "g"), "_");
            urlReportTimeSpan = urlReportTimeSpan.replace(" - ", "-");
            this.location.replaceState("triage/report/" + this.displayType.toLowerCase() + "/" + urlReportTimeSpan);
        }
    }

    initTables(report: TriageReport) {
        this.currentReport = report;
        this.allViewCount = report.triageReportSummary.allViewCount;
       
        //triageReportSummary
        this.triageReportSummary = this.getTriageReportSummary(report.triageReportSummary);
        //triageReportDetails
        this.allTriageReportDetails = report.triageReportDetails;

        //missSlaSummary
        this.missSlaSummary = this.getMissSlaSummary(report.triageReportSummary.missSlaSummary);
        this.triageSummary = this.getTriageSummary(report.triageReportSummary.triageSummary);
        this.errorSummary = this.getErrorSummary(report.triageReportSummary.errorSummary);
        this.longLatencySummary = this.getLongLatencySummary(report.triageReportSummary.longLatencySummary);

        //missSlaSummary
        this.versionLatencyRank = report.triageReportSummary.rankSummary.versionLatencyRank;
        this.segmentRanks = report.triageReportSummary.rankSummary.segmentRanks;
        this.ownerRanks = report.triageReportSummary.rankSummary.ownerRanks;
        this.viewNameRanks = report.triageReportSummary.rankSummary.viewNameRanks;
        this.viewNameRanks = this.viewNameRanks.filter(viewNameRank => (viewNameRank.missSlaTimes + viewNameRank.triagedTimes + viewNameRank.erroredTimes > 0))

        this.versionLatencyRank.zeroToFifty = this.getLatencyRankFacet(this.versionLatencyRank.zeroToFifty);
        this.versionLatencyRank.fiftyToNinety = this.getLatencyRankFacet(this.versionLatencyRank.fiftyToNinety);
        this.versionLatencyRank.ninetyToHundred = this.getLatencyRankFacet(this.versionLatencyRank.ninetyToHundred);

        this.allTriageViewSupervisors = new Array<TriageViewSupervisor>();
        if (this.allTriageReportDetails.length >0 ) {
            this.allTriageReportDetails.forEach(triageReportDetail => {
                let triageViewSupervisor = new TriageViewSupervisor();
                if(triageReportDetail != null){
                    triageViewSupervisor.id = triageReportDetail.id;
                    triageViewSupervisor.customerId = triageReportDetail.customerId;
                    triageViewSupervisor.customerEnv = triageReportDetail.customerEnv;
                    triageViewSupervisor.entitySpaceName = triageReportDetail.entitySpaceName;
                    triageViewSupervisor.entitySpaceViewName = triageReportDetail.viewName;
                    triageViewSupervisor.segment = triageReportDetail.segment;
                    triageViewSupervisor.originalState = triageReportDetail.viewState;
                    triageViewSupervisor.owner = triageReportDetail.owner;
                    triageViewSupervisor.missSla = triageReportDetail.allVersions.filter(t => t.isMissSla).length;
                    triageViewSupervisor.updates = triageReportDetail.refreshedTimes;
                    triageViewSupervisor.averageLatency = triageReportDetail.averageLatency;
                    triageViewSupervisor.ninetyPercentLatency = triageReportDetail.ninetyLatency;
                    triageViewSupervisor.minLatency = triageReportDetail.minLatency;
                    triageViewSupervisor.maxLatency = triageReportDetail.maxLatency;
                    triageViewSupervisor.triageTimes = triageReportDetail.allVersions.filter(t => t.isTriaged).length;
                    triageViewSupervisor.latestVersionLatency = triageReportDetail.latestVersionLatency;
                    triageViewSupervisor.latestSucceedVersionLatency = triageReportDetail.latestSucceedVersionLatency;
                }
                this.allTriageViewSupervisors.push(triageViewSupervisor);
            });
            this.allTriageViewSupervisors.sort((a, b) => (a.entitySpaceViewName > b.entitySpaceViewName ? 1 : -1));
            this.logger.info("this.allTriageViewSupervisors", this.allTriageViewSupervisors);
        }
    }

    getMissSlaSummary(missSlaSummary: MissSlaSummary): MissSlaSummary {
        missSlaSummary.everyVersion = this.getMissSlaFacet(missSlaSummary.everyVersion);
        missSlaSummary.majorVersion = this.getMissSlaFacet(missSlaSummary.majorVersion);
        missSlaSummary.manual = this.getMissSlaFacet(missSlaSummary.manual);
        let newMissSlaSummary = new MissSlaSummary(
            missSlaSummary.missSlaViewCount,
            missSlaSummary.missSlaTimes,
            missSlaSummary.everyVersion,
            missSlaSummary.majorVersion,
            missSlaSummary.manual
        )
        return newMissSlaSummary;
    }

    getMissSlaFacet(version: MissSlaFacet): MissSlaFacet {
        version.rootCauseToSucceedIds = this.getRootCauseFacet(version.rootCauseToSucceedIds);
        version.rootCauseToFailedIds = this.getRootCauseFacet(version.rootCauseToFailedIds);
        let newMissSlaFacet = new MissSlaFacet(
            version.rootCauseToSucceedIds,
            version.rootCauseToFailedIds,
            version.succeedViewCount,
            version.failedViewCount,
            version.stateCount,
            version.missSlaTimes,
            version.aveSlaGap
        )
        return newMissSlaFacet;
    }

    getRootCauseFacet(rootCauseFacet: RootCauseFacet): RootCauseFacet {
        let newRootCauseFacet = new RootCauseFacet(
            rootCauseFacet.unknow,
            rootCauseFacet.triage,
            rootCauseFacet.error,
            rootCauseFacet.noSchedule,
            rootCauseFacet.lateSchedule,
            rootCauseFacet.longQueue,
            rootCauseFacet.longRunning
        )
        return newRootCauseFacet;
    }

    getErrorSummary(errorSummary: ErrorSummary): ErrorSummary {
        errorSummary.everyVersion = this.getErrorFacet(errorSummary.everyVersion);
        errorSummary.majorVersion = this.getErrorFacet(errorSummary.majorVersion);
        errorSummary.manual = this.getErrorFacet(errorSummary.manual);
        let newErrorSummary = new ErrorSummary(
            errorSummary.errorViewCount,
            errorSummary.errorTimes,
            errorSummary.everyVersion,
            errorSummary.majorVersion,
            errorSummary.manual
        )
        return newErrorSummary;
    }

    getErrorFacet(errorFacet: ErrorFacet): ErrorFacet {
        let newErrorFacet = new ErrorFacet(
            errorFacet.errorTimes,
            errorFacet.erroredIds,
            errorFacet.stateCount
        )
        return newErrorFacet;
    }

    getTriageSummary(triageSummary: TriageSummary): TriageSummary {
        triageSummary.everyVersion = this.getTriageFacet(triageSummary.everyVersion);
        triageSummary.majorVersion = this.getTriageFacet(triageSummary.majorVersion);
        triageSummary.manual = this.getTriageFacet(triageSummary.manual);
        let newTriageSummary = new TriageSummary(
            triageSummary.triageViewCount,
            triageSummary.triageTimes,
            triageSummary.everyVersion,
            triageSummary.majorVersion,
            triageSummary.manual
        )
        return newTriageSummary;
    }

    getTriageFacet(triageFacet: TriageFacet): TriageFacet {
        let newTriageFacet = new TriageFacet(
            triageFacet.aveCommitLatency,
            triageFacet.commitedIds,
            triageFacet.stateCount,
            triageFacet.triageTimes,
            triageFacet.uncommitedIds
        )
        return newTriageFacet;
    }

    getLongLatencySummary(longLatencySummary: LongLatencySummary): LongLatencySummary {
        let newLongLatencySummary = new LongLatencySummary(
            longLatencySummary.everyVersion,
            longLatencySummary.majorVersion,
            longLatencySummary.manual
        )
        return newLongLatencySummary;
    }

    getLatencyRankFacet(latencyRankFacet: LatencyRankFacet): LatencyRankFacet {
        let newLatencyRankFacet = new LatencyRankFacet(
            latencyRankFacet.maxLatency,
            latencyRankFacet.minLatency,
            latencyRankFacet.aveLatency,
            latencyRankFacet.ids,
        )
        return newLatencyRankFacet;
    }

    getTriageReportSummary(triageReportSummary: TriageReportSummary): TriageReportSummary {
        let newTriageReportSummary = new TriageReportSummary(
            triageReportSummary.allViewCount,
            triageReportSummary.allRefreshTimes,
            triageReportSummary.everyVersionRefreshtimes,
            triageReportSummary.majorVersionRefreshtimes,
            triageReportSummary.manualRefreshtimes,
            triageReportSummary.errorPercent,
            triageReportSummary.missSlaPercent,
            triageReportSummary.triagePercent,
            triageReportSummary.missSlaSummary,
            triageReportSummary.errorSummary,
            triageReportSummary.longLatencySummary,
            triageReportSummary.triageSummary,
            triageReportSummary.rankSummary
        )
        return newTriageReportSummary;
    }

    //#region get previous and get next report
    getPreReport() {
        let index: number = 0;
        for (let i = 0; i < this.reportTimeSpans.length; i++) {
            if (this.reportTimeSpans[i] == this.currentRegularReportTimeSpan) {
                index = i;
            }
        }
        index = index == this.reportTimeSpans.length - 1 ? 0 : index + 1;
        this.changeReportTimeSpan(this.reportTimeSpans[index]);
    }

    getNextReport() {
        let index: number = 0;
        for (let i = 0; i < this.reportTimeSpans.length; i++) {
            if (this.reportTimeSpans[i] == this.currentRegularReportTimeSpan) {
                index = i;
            }
        }
        index = index == 0 ? 0 : index - 1;
        this.changeReportTimeSpan(this.reportTimeSpans[index]);
    }
    //#endregion

    //#region get supervisors in modal
    getModalSupervisors(triagedViewIds: Array<number>) {
        this.modalTriageViewSupervisors = new Array<TriageViewSupervisor>();
        this.modalTriageViewSupervisors = this.allTriageViewSupervisors.filter(
            t => triagedViewIds.find(d => d == t.id) != null
        );
        this.modalTriageViewSupervisors.map(t => (t.expandStatistic = false));
        this.modalTriageViewSupervisors.forEach(modalTriageViewSupervisor => {
            this.allTriageReportDetails.filter(triageReportDetail => {
                if (triageReportDetail.id == modalTriageViewSupervisor.id) {
                    modalTriageViewSupervisor.allVersions = triageReportDetail.allVersions;
                }
            })
        })
        this.logger.info("this.modalTriageViewSupervisors", this.modalTriageViewSupervisors);
    }
    //#endregion

    //#region sort
    sortSegmentRanks(column: string) {
        switch (column) {
            case "Segment":
                this.segmentRankNameDesc = !this.segmentRankNameDesc;
                let segmentRankNameDescNum = this.segmentRankNameDesc ? 1 : -1;
                this.segmentRanks.sort((a, b) => segmentRankNameDescNum * (b.attribute > a.attribute ? 1 : -1));
                break;
            case "MissSla":
                this.segmentRankMissSlaDesc = !this.segmentRankMissSlaDesc;
                let segmentRankMissSlaDescNum = this.segmentRankMissSlaDesc ? 1 : -1;
                this.segmentRanks.sort(
                    (a, b) => segmentRankMissSlaDescNum * (b.missSlaViewsIds.length - a.missSlaViewsIds.length)
                );
                break;
            case "Triage":
                this.segmentRankTriageDesc = !this.segmentRankTriageDesc;
                let segmentRankTriageDescNum = this.segmentRankTriageDesc ? 1 : -1;
                this.segmentRanks.sort(
                    (a, b) => segmentRankTriageDescNum * (b.triagedViewsIds.length - a.triagedViewsIds.length)
                );
                break;
            case "Error":
                this.segmentRankErrorDesc = !this.segmentRankErrorDesc;
                let segmentRankErrorDescNum = this.segmentRankErrorDesc ? 1 : -1;
                this.segmentRanks.sort((a, b) => segmentRankErrorDescNum * (b.erroredViewsIds.length - a.erroredViewsIds.length));
                break;
        }
    }

    sortOwnerRanks(column: string) {
        switch (column) {
            case "Owner":
                this.ownerRankNameDesc = !this.ownerRankNameDesc;
                let ownerRankNameDescNum = this.ownerRankNameDesc ? 1 : -1;
                this.ownerRanks.sort((a, b) => ownerRankNameDescNum * (b.attribute > a.attribute ? 1 : -1));
                break;
            case "MissSla":
                this.ownerRankMissSlaDesc = !this.ownerRankMissSlaDesc;
                let ownerRankMissSlaDescNum = this.ownerRankMissSlaDesc ? 1 : -1;
                this.ownerRanks.sort((a, b) => ownerRankMissSlaDescNum * (b.missSlaViewsIds.length - a.missSlaViewsIds.length));
                break;
            case "Triage":
                this.ownerRankTriageDesc = !this.ownerRankTriageDesc;
                let ownerRankTriageDescNum = this.ownerRankTriageDesc ? 1 : -1;
                this.ownerRanks.sort((a, b) => ownerRankTriageDescNum * (b.triagedViewsIds.length - a.triagedViewsIds.length));
                break;
            case "Error":
                this.ownerRankErrorDesc = !this.ownerRankErrorDesc;
                let ownerRankErrorDescNum = this.ownerRankErrorDesc ? 1 : -1;
                this.ownerRanks.sort((a, b) => ownerRankErrorDescNum * (b.erroredViewsIds.length - a.erroredViewsIds.length));
                break;
        }
    }

    sortViewNameRanks(column: string) {
        switch (column) {
            case "ViewName":
                this.viewNameRankNameDesc = !this.viewNameRankNameDesc;
                let viewNameRankNameDescNum = this.viewNameRankNameDesc ? 1 : -1;
                this.viewNameRanks.sort((a, b) => viewNameRankNameDescNum * (b.viewName > a.viewName ? 1 : -1));
                break;
            case "Triage":
                this.viewNameRankTriageDesc = !this.viewNameRankTriageDesc;
                let viewNameRankTriageDescNum = this.viewNameRankTriageDesc ? 1 : -1;
                this.viewNameRanks.sort((a, b) => viewNameRankTriageDescNum * (b.triagedTimes - a.triagedTimes));
                break;
            case "Error":
                this.viewNameRankErrorDesc = !this.viewNameRankErrorDesc;
                let viewNameRankErrorDescNum = this.viewNameRankErrorDesc ? 1 : -1;
                this.viewNameRanks.sort((a, b) => viewNameRankErrorDescNum * (b.erroredTimes - a.erroredTimes));
                break;
            case "MissSla":
                this.viewNameRankMissSlaDesc = !this.viewNameRankMissSlaDesc;
                let viewNameRankMissSlaDescNum = this.viewNameRankMissSlaDesc ? 1 : -1;
                this.viewNameRanks.sort((a, b) => viewNameRankMissSlaDescNum * (b.missSlaTimes - a.missSlaTimes));
                break;
        }
    }

    generatecViewVersionMetriLineChartResult(dailyViewVersionMetric: Array<DailyViewVersionMetric>, viewCount: number) {
        let multiChartDatas = new Array<MultiChartData>();
        if (dailyViewVersionMetric.length == 0) {
            multiChartDatas.push(new MultiChartData(Constants.none, [new SingleChartData(Constants.none, 0)]));
            this.viewVersionMetriLineChart.lineChartDetailDict.set(Constants.none, new MetricFacet([], 0, Constants.none, 0));
        }
        multiChartDatas[0] = new MultiChartData("missSla");
        multiChartDatas[1] = new MultiChartData("triage");
        multiChartDatas[2] = new MultiChartData("error");
        
        let startTime = moment(new Date(this.currentReportTimeSpan.split("-")[0]));
        let endTime = moment(new Date(this.currentReportTimeSpan.split("-")[1]));
        let timespan = Number(endTime.diff(startTime, 'days', true).toFixed(2));

        dailyViewVersionMetric.forEach(t => {
            if(t.viewCount != 0){
                this.missSlaPercent = Number((t.missSlaDaliyMetricFacet.viewCount / viewCount * 100).toFixed(2));
                this.triagePercent = Number((t.triageDaliyMetricFacet.viewCount / viewCount * 100).toFixed(2));
                this.errorPercent = Number((t.errorDaliyMetricFacet.viewCount / viewCount * 100).toFixed(2));
            }
            else{
                this.missSlaPercent = 0;
                this.triagePercent = 0;
                this.errorPercent = 0;
            }

            for (let i = 0; i <= timespan; i++) {
                if (!multiChartDatas[0].series[i] && !multiChartDatas[1].series[i] && !multiChartDatas[2].series[i]) {
                    multiChartDatas[0].series[i] = new SingleChartData(t.shortDate, this.missSlaPercent);
                    multiChartDatas[1].series[i] = new SingleChartData(t.shortDate, this.triagePercent);
                    multiChartDatas[2].series[i] = new SingleChartData(t.shortDate, this.errorPercent);
                    break;
                }
            }
            this.viewVersionMetriLineChart.lineChartDetailDict.set(t.shortDate + "missSla", t.missSlaDaliyMetricFacet);
            this.viewVersionMetriLineChart.lineChartDetailDict.set(t.shortDate + "triage", t.triageDaliyMetricFacet);
            this.viewVersionMetriLineChart.lineChartDetailDict.set(t.shortDate + "error", t.errorDaliyMetricFacet);
        });

        return multiChartDatas;
    }

    getViewVersionMetricLineChart(dailyViewVersionMetric: Array<DailyViewVersionMetric>, viewCount: number) {
        let colorDomain = new Array("#f0ad4e", "#ffa1b5", "#FF0000");
        this.viewVersionMetriLineChart = new LineChart();
        this.viewVersionMetriLineChart.scheme.domain = colorDomain;
        this.viewVersionMetriLineChart.yAxisLabel = 'Percentage';
        this.viewVersionMetriLineChart.results = this.generatecViewVersionMetriLineChartResult(dailyViewVersionMetric, viewCount);
    }

    changeViewVersion(type: string) {
        switch (type) {
            case "EveryVersion":
                this.getViewVersionMetricLineChart(this.viewVersionMetric.everyVersion, this.viewVersionMetric.everyVersionViewCount);
                break;
            case "MajorVersion":
                this.getViewVersionMetricLineChart(this.viewVersionMetric.majorVersion, this.viewVersionMetric.majorVersionViewCount);
                break;
            case "Manual":
                this.getViewVersionMetricLineChart(this.viewVersionMetric.manual, this.viewVersionMetric.manualViewCount);
                break;
        }
    }
}
