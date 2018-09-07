import { MultiChartData, SingleChartData, LineChart, StackedVerticalBarChart, VerticalBarChart } from "../plugin/ngxChart";
import { Constants } from "../common/constants";
import { ViewVersionDuration, ViewStateTimeStamp, TriageCommitDuration, TriageAndErrorDistribution, ViewVersionLatencyDetail, ViewVersionLatency, VersionLatencyStateDetail, VersionLatencyStateDetailUnit } from "./triageStatistic";
import * as moment from 'moment';

export class TriageViewSupervisor {
    constructor(
        public id?: number,
        public triageAnalysisId?: number,
        public customerId?: string,
        public customerEnv?: string,
        public entitySpaceName?: string,
        public entitySpaceViewName?: string,
        public segment?: string,
        public currentState?: string,
        public originalState?: string,
        public latestVersion?: string,
        public latestVersionState?: string,
        public latestCompletedVersion?: string,
        public latestCompletedVersionState?: string,
        public latestSucceedTime?: string,
        public latestVersionLatency?: number,
        public latestSucceedVersionLatency?: number,
        public latestStandardVersion?: string,
        public latestJobType?: string,
        public deletedCount?: string,
        public addedCount?: string,
        public churnedCount?: string,
        public owner?: string,
        public tfsUrl?: string,
        public expandStatistic?: boolean,
        public versionDelayLineChart?: LineChart,
        public commitDelayLineChart?: LineChart,
        public monthlyCountLineChart?: LineChart,
        public viewVersionDuration?: ViewVersionDuration,
        public versionDelayStackedVerticalBarChart?: StackedVerticalBarChart,
        public versionDetailStackedVerticalBarChart?: StackedVerticalBarChart,
        public missSlaBarChart?: VerticalBarChart,
        public completeVersions?: Array<MultiChartData>,
        public mouseOverDelete?: boolean,
        public displayOwnerNameEditor?: boolean,
        public displaySegmentNameEditor?: boolean,
        public missSla?: number,
        public updates?: number,
        public triageTimes?: number,
        public averageLatency?: string,
        public minLatency?: string,
        public maxLatency?: string,
        public fiftyPercentLatency?: string,
        public ninetyPercentLatency?: string,
        public allVersions?: Array<ViewVersionLatency>
    ) {
        this.versionDelayLineChart = new LineChart();
        this.commitDelayLineChart = new LineChart();
        this.monthlyCountLineChart = new LineChart();
        this.viewVersionDuration = new ViewVersionDuration();
        this.versionDelayStackedVerticalBarChart = new StackedVerticalBarChart();
        this.versionDetailStackedVerticalBarChart = new StackedVerticalBarChart();
        this.missSlaBarChart = new VerticalBarChart();
        this.completeVersions = new Array<MultiChartData>();
    }

    get customerIdEnv(): string {
        return `${this.customerId}-${this.customerEnv}`;
    }

    get viewKey(): string {
        return `${this.entitySpaceName}_${this.entitySpaceViewName}`;
    }

    get triageAnalysisUrl(): string {
        return `/triage/analysis/${this.customerIdEnv}/${this.viewKey}`;
    }

    get entitySpaceViewUrl(): string {
        let underlineSplitedVersionNum = "";
        if(this.latestVersion){
            underlineSplitedVersionNum = this.latestVersion.replace(/\./g, "_");
        }else{
            underlineSplitedVersionNum = "";
        } 
            
        return `http://entityrepository.binginternal.com:88/ERPortal/PROD/${this.customerId}-${
                this.customerEnv
                }/EntitySpaceOverview/EntitySpaceViewDetails?entitySpaceName=${this.entitySpaceName}&viewKey=${this.viewKey}#v${underlineSplitedVersionNum}`;
    }

    generateVersionDelayLineChartResult(viewVersionLatency: Array<ViewVersionLatency>) {
        let multiChartDatas = new Array<MultiChartData>();

        multiChartDatas[0] = new MultiChartData("Version Delay");
        let singleChartDatas = new Array<SingleChartData>();
        if (viewVersionLatency.length == 0) {
            multiChartDatas[0] = new MultiChartData("no triage", [new SingleChartData(Constants.none, 0)]);
            this.versionDelayLineChart.lineChartDetailDict.set(Constants.none, new ViewStateTimeStamp(Constants.none, Constants.none, Constants.none));
            return multiChartDatas;
        }
        viewVersionLatency.forEach(t => {
            multiChartDatas[0].series.push(new SingleChartData(t.version, Number(t.totalTime)));
            this.versionDelayLineChart.lineChartDetailDict.set(t.version, t);
        })
        return multiChartDatas;
    }

    getVersionDelayLineChart(viewVersionLatency: Array<ViewVersionLatency>) {
        let colorDomain = new Array("#a8385d", "#FFA1B5", "#86C7F3", "#5aa454");
        this.versionDelayLineChart = new LineChart();
        this.versionDelayLineChart.view = [1700, 400];
        this.versionDelayLineChart.results = new Array();
        this.versionDelayLineChart.scheme.domain = colorDomain;
        this.versionDelayLineChart.results = this.generateVersionDelayLineChartResult(viewVersionLatency);
    }

    generateCommitDelayLineChartResult(viewVersionLatency: Array<ViewVersionLatency>) {
        let multiChartDatas = new Array<MultiChartData>();

        multiChartDatas[0] = new MultiChartData("triage");
        let singleChartDatas = new Array<SingleChartData>();
        if (viewVersionLatency.length == 0) {
            multiChartDatas[0] = new MultiChartData("no triage", [new SingleChartData(Constants.none, 0)]);
            this.commitDelayLineChart.lineChartDetailDict.set(Constants.none, new ViewStateTimeStamp(Constants.none, Constants.none, Constants.none));
            return multiChartDatas;
        }
        viewVersionLatency.forEach(t => {
            if (t.isTriaged && t.isCommited) {
                multiChartDatas[0].series.push(new SingleChartData(t.version, Number(t.commitedTime)));
            }
            else {
                multiChartDatas[0].series.push(new SingleChartData(t.version, 0));
            }
            this.commitDelayLineChart.lineChartDetailDict.set(t.version, t);
        });

        return multiChartDatas;
    }

    getCommitDelayLineChart(viewVersionLatency: Array<ViewVersionLatency>) {
        let colorDomain = new Array("#FFA1B5", "#86C7F3", "#5aa454");
        this.commitDelayLineChart = new LineChart();
        this.commitDelayLineChart.view = [1700, 400];
        this.commitDelayLineChart.results = new Array();
        this.commitDelayLineChart.scheme.domain = colorDomain;
        this.commitDelayLineChart.results = this.generateCommitDelayLineChartResult(viewVersionLatency);
    }

    groupBy(objectArray: any, property: string) {
        return objectArray.reduce(function (acc: any, obj: any) {
            var key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    generateMonthlyCountLineChartResult(viewVersionLatency: Array<ViewVersionLatency>) {
        let multiChartDatas = new Array<MultiChartData>();
        if (viewVersionLatency.length == 0) {
            multiChartDatas[0] = new MultiChartData("no triage", [new SingleChartData(Constants.none, 0)]);
            this.commitDelayLineChart.lineChartDetailDict.set(Constants.none, new ViewStateTimeStamp(Constants.none, Constants.none, Constants.none));
        }
        multiChartDatas[0] = new MultiChartData("triage");
        multiChartDatas[1] = new MultiChartData("error");
        multiChartDatas[2] = new MultiChartData("missSLA");
        multiChartDatas[3] = new MultiChartData("standard");

        let versionLatency = this.groupBy(viewVersionLatency, 'date');

        for (var t in versionLatency) {
            let triageCount = 0, errorCount = 0, missSlaCount = 0;

            versionLatency[t].forEach((version: any) => {
                triageCount = version.isTriaged ? triageCount + 1 : triageCount;
                errorCount = version.isErrored ? errorCount + 1 : errorCount;
                missSlaCount = version.isMissSla ? missSlaCount + 1 : missSlaCount;
            });
            for (let i = 0; i < Constants.monthDays; i++) {
                if (!multiChartDatas[0].series[i] && !multiChartDatas[1].series[i] && !multiChartDatas[2].series[i] && !multiChartDatas[3].series[i]) {
                    multiChartDatas[0].series[i] = new SingleChartData(t, triageCount);
                    multiChartDatas[1].series[i] = new SingleChartData(t, errorCount);
                    multiChartDatas[2].series[i] = new SingleChartData(t, missSlaCount);
                    multiChartDatas[3].series[i] = new SingleChartData(t, versionLatency[t].length - triageCount - errorCount);
                    break;
                }
            }
            this.monthlyCountLineChart.lineChartDetailDict.set(t + "triage", versionLatency[t]);
            this.monthlyCountLineChart.lineChartDetailDict.set(t + "error", versionLatency[t]);
            this.monthlyCountLineChart.lineChartDetailDict.set(t + "missSLA", versionLatency[t]);
            this.monthlyCountLineChart.lineChartDetailDict.set(t + "standard", versionLatency[t]);
        }
        return multiChartDatas;
    }

    getMonthlyCountLineChart(viewVersionLatency: Array<ViewVersionLatency>) {
        let colorDomain = new Array("#ffa1b5", "#FF0000", "#f0ad4e", "#5aa454");
        this.monthlyCountLineChart = new LineChart();
        this.monthlyCountLineChart.view = [1700, 400];
        this.monthlyCountLineChart.scheme.domain = colorDomain;
        this.monthlyCountLineChart.results = this.generateMonthlyCountLineChartResult(viewVersionLatency);
    }

    getversionStateDetails(viewVersionLatency: Array<ViewVersionLatency>) {
        let viewVersionDetails = new Array<ViewVersionLatencyDetail>();

        viewVersionLatency.forEach((t, index) => {
            let viewVersionDetail = new ViewVersionLatencyDetail(t.createdTimestamp, t.version, t.updateType, new VersionLatencyStateDetail());
            let versionStateDetail = viewVersionDetail.versionStateDetail;
            versionStateDetail.queue = new VersionLatencyStateDetailUnit("Queue", null, "0");
            versionStateDetail.building = new VersionLatencyStateDetailUnit("Building", null, "0");
            versionStateDetail.updating = new VersionLatencyStateDetailUnit("Updating", null, "0");
            versionStateDetail.commited = new VersionLatencyStateDetailUnit("Commited", null, "0");
            versionStateDetail.errored = new VersionLatencyStateDetailUnit("Errored", null, "0");
            versionStateDetail.standard = new VersionLatencyStateDetailUnit("Standard", null, "0");
            versionStateDetail.timeout = new VersionLatencyStateDetailUnit("Timeout", null, "0");
            versionStateDetail.retry = new VersionLatencyStateDetailUnit("Retry", null, "0");
            //queue Time
            versionStateDetail.queue = new VersionLatencyStateDetailUnit('Queue', t.jobStartTimeStamp, t.queuedTime);
            //retry
            let retryTimetamp = moment(new Date(t.createdTimestamp)).add(Number(t.retryTime), "hours").format("YYYY/MM/DD hh:mm:ss");
            versionStateDetail.retry = new VersionLatencyStateDetailUnit('Retry', retryTimetamp, t.retryTime);
            //run Time

            switch (t.state) {
                //running => error ,should be dark red after queue in front end
                case "Errored":
                    versionStateDetail.errored = new VersionLatencyStateDetailUnit("Errored", t.erroredTimestamp, t.runningTime);
                    break;
                //running => standard ,should be green after queue in front end
                case "Standard":
                    if (!t.isTriaged) {
                        versionStateDetail.standard = new VersionLatencyStateDetailUnit("Standard", t.sealedTimestamp, t.runningTime);
                    }
                    break;
                //should be blue after queue in front end
                default:
                    //updateType is building
                    if (t.updateType == "Building") {
                        versionStateDetail.building = new VersionLatencyStateDetailUnit("Building", t.sealedTimestamp, t.runningTime);
                    }
                    //updateType is updating
                    else {
                        versionStateDetail.updating = new VersionLatencyStateDetailUnit("Updating", t.sealedTimestamp, t.runningTime);
                    }
                    break;
            }

            //comitte or triage to timeout
            //judge if triage has committed
            if (t.isTriaged) {
                if (t.isCommited) {
                    versionStateDetail.commited = new VersionLatencyStateDetailUnit("Commited", t.sealedTimestamp, t.commitedTime);
                }
                else {
                    let timeoutSpan;
                    if (t.originalState == 'EveryVersion' || !t.originalState) {
                        timeoutSpan = Constants.everyVersionTimeout;
                    }
                    else if (t.originalState == 'MajorVersion') {
                        timeoutSpan = Constants.majorVersionTimeout;
                    }
                    else if (t.originalState == "Manual") {
                        timeoutSpan = Constants.manualTimeout;
                    }
                    if (index == viewVersionLatency.length - 1) {
                        versionStateDetail.timeout = new VersionLatencyStateDetailUnit("Timeout", moment().format("YYYY/MM/DD hh:mm:ss"), timeoutSpan.toString());
                    }
                    else {
                        let createTime = moment(new Date(viewVersionLatency[index + 1].createdTimestamp));
                        let triageTime = moment(new Date(t.triagedTimestamp));
                        let durationToNext = Number(createTime.diff(triageTime, 'hours', true).toFixed(2));
                        timeoutSpan = timeoutSpan < durationToNext ? timeoutSpan : durationToNext;
                        versionStateDetail.timeout = new VersionLatencyStateDetailUnit("Timeout", moment(triageTime).add(timeoutSpan, 'hours').format("YYYY/MM/DD hh:mm:ss"), timeoutSpan.toString());
                    }
                }
                //should be blue after queue in front endS
                //updateType is building
                if (t.updateType == "Building") {
                    versionStateDetail.building = new VersionLatencyStateDetailUnit("Building", t.triagedTimestamp, t.runningTime);
                }
                //updateType is updating
                else {
                    versionStateDetail.updating = new VersionLatencyStateDetailUnit("Updating", t.triagedTimestamp, t.runningTime);
                }
            }
            viewVersionDetails.push(viewVersionDetail);
        });
        return viewVersionDetails;
    }

    generatetVersionDetailStackedVerticalBarChartResult(viewVersionDetails: Array<ViewVersionLatencyDetail>) {
        let versionDetails = new Array<MultiChartData>();
        if (viewVersionDetails.length == 0) {
            versionDetails.push(new MultiChartData("no version", [new SingleChartData(Constants.none, 0)]));
            this.versionDelayStackedVerticalBarChart.stackedVerticalBarChartDetailDict.set(Constants.none, new ViewStateTimeStamp(Constants.none, Constants.none, Constants.none));
            return versionDetails;
        }

        viewVersionDetails.forEach(t => {
            let versionLatencyStateDetails = new Array<SingleChartData>(
                new SingleChartData(t.versionStateDetail.retry.state, Number(t.versionStateDetail.retry.cost)),
                new SingleChartData(t.versionStateDetail.queue.state, Number(t.versionStateDetail.queue.cost)),
                new SingleChartData(t.versionStateDetail.building.state, Number(t.versionStateDetail.building.cost)),
                new SingleChartData(t.versionStateDetail.updating.state, Number(t.versionStateDetail.updating.cost)),
                new SingleChartData(t.versionStateDetail.commited.state, Number(t.versionStateDetail.commited.cost)),
                new SingleChartData(t.versionStateDetail.errored.state, Number(t.versionStateDetail.errored.cost)),
                new SingleChartData(t.versionStateDetail.standard.state, Number(t.versionStateDetail.standard.cost)),
                new SingleChartData(t.versionStateDetail.timeout.state, Number(t.versionStateDetail.timeout.cost))
            );

            //set the TooltipTemplate
            //all block in a column use same timestamp and satme version
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict.set(t.timeStamp, t);
            //blocks in a column different from state, so the key is timeStamp plus state
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.retry.state, t.versionStateDetail.retry.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.queue.state, t.versionStateDetail.queue.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.building.state, t.versionStateDetail.building.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.updating.state, t.versionStateDetail.updating.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.commited.state, t.versionStateDetail.commited.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.errored.state, t.versionStateDetail.errored.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.standard.state, t.versionStateDetail.standard.endTime);
            this.versionDetailStackedVerticalBarChart.stackedVerticalBarChartDetailDict
                .set(t.timeStamp + t.versionStateDetail.timeout.state, t.versionStateDetail.timeout.endTime);
            versionDetails.push(new MultiChartData(t.timeStamp, versionLatencyStateDetails));
        });
        return versionDetails;
    }

    getVersionDetailStackedVerticalBarChart(viewVersionLatency: Array<ViewVersionLatency>) {
        let viewVersionDetails = this.getversionStateDetails(viewVersionLatency);
        let colorDomain = new Array("#ff6600","#1d627e", "#389ec5", "#c6efff", "#FFA1B5", "#a8385d", "#5aa454", "#f9b145");
        this.versionDetailStackedVerticalBarChart = new StackedVerticalBarChart();
        this.versionDetailStackedVerticalBarChart.view = [1700, 350];
        this.versionDetailStackedVerticalBarChart.results = new Array();
        this.versionDetailStackedVerticalBarChart.scheme.domain = colorDomain;
        this.versionDetailStackedVerticalBarChart.results =
            [...this.generatetVersionDetailStackedVerticalBarChartResult(viewVersionDetails)];//[...array] can dynamic change array content
    }

    generatetMissSlaBarChartResult(viewVersionLatency: Array<ViewVersionLatency>) {
        let missSlaChartData = new Array<SingleChartData>();
        if (viewVersionLatency.length == 0) {
            missSlaChartData.push(new SingleChartData(Constants.none, 0));
            this.missSlaBarChart.verticalBarChartDict.set(Constants.none, new ViewStateTimeStamp(Constants.none, Constants.none, Constants.none));
            return missSlaChartData;
        }

        viewVersionLatency.forEach(t => {
            this.missSlaBarChart.verticalBarChartDict.set(t.createdTimestamp, t);
            missSlaChartData.push(
                new SingleChartData(
                    t.createdTimestamp,
                    Number(t.totalTime)
                )
            )
        });
        return missSlaChartData;
    }

    getMissSlaBarChart(viewVersionLatency: Array<ViewVersionLatency>) {
        let colorDomain = new Array();
        viewVersionLatency.forEach(t => {
            if (t.isMissSla) {
                colorDomain.push("#FF0000")
            }
            else {
                colorDomain.push("#008800")
            }
        })

        this.missSlaBarChart = new VerticalBarChart();
        this.missSlaBarChart.view = [1700, 350];
        this.missSlaBarChart.legend = false;
        this.missSlaBarChart.scheme.domain = colorDomain;
        this.missSlaBarChart.results = this.generatetMissSlaBarChartResult(viewVersionLatency);
    }
}

export class TriageViewSupervisorDto {
    constructor(
        public customerId?: string,
        public customerEnv?: string,
        public entitySpaceName?: string,
        public entitySpaceViewName?: string,
        public segment?: string,
        public owner?: string
    ) { }
}
