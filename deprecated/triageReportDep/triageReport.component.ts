// import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
// import { BaseComponent } from "../../common/base.component";
// import { TriageService } from "../triage.service";
// import { TriageReport, TriageAndErrorCountDetail, DurationStageDetail } from "../../../core/triage/triageReport";
// import {
// 	AdvancedPieChart,
// 	SingleChartData,
// 	VerticalBarChart,
// 	LineChart,
// 	GroupedVerticalBarChart,
// 	StackedVerticalBarChart,
//     MultiChartData,
//     NumberCardChart
// } from "../../../core/plugin/ngxChart";
// import { Constants } from "../../../core/common/constants";
// import { TriageStatisticComponent } from "../triageStatistic/triageStatistic.component";
// import { TriageViewSupervisor } from "../../../core/triage/triageViewSupervisor";
// import { TriageStatistic, ViewVersionDuration, DailyCount, DailyErrorTriageViewName, VersionDuration } from "../../../core/triage/triageStatistic";
// import { forEach } from "@angular/router/src/utils/collection";
// import { ReportType } from "../../../core/enums";
// import { ActivatedRoute } from "@angular/router";
// import { Location } from "@angular/common";
// import { IMyDateModel } from "ngx-mydatepicker";

// @Component({
// 	selector: "triage-report",
// 	templateUrl: "./triageReport.component.html",
// 	styleUrls: ["./triageReport.component.css"]
// })
// export class TriageReportComponent extends BaseComponent implements OnInit {
// 	@ViewChild("viewTable") viewTable: ElementRef;
// 	@ViewChild("topVersionDuration") topVersionDuration: ElementRef;
// 	@ViewChild("topCommitDuration") topCommitDuration: ElementRef;

// 	reportType: string;
// 	startDate: any;
// 	endDate: any;
// 	reportTypes: Array<string>;
// 	currentReportTimeSpan: string;
// 	currentCustomizedReportTimeSpan: string;
// 	currentRegularReportTimeSpan: string;
// 	reportTimeSpans: Array<string>;
// 	distributionPieChart: AdvancedPieChart;
// 	distributionTopTenVerticalBarChart: VerticalBarChart;
// 	versionDurationPieChart: AdvancedPieChart;
// 	versionDurationTopTenVerticalBarChart: VerticalBarChart;
// 	commitDurationPieChart: AdvancedPieChart;
// 	commitDurationTopTenVerticalBarChart: VerticalBarChart;
// 	triageViewSupervisors: Array<TriageViewSupervisor>;
// 	totalLineChart: LineChart;
// 	summaryNumberCardChart: NumberCardChart;
// 	triageAndErrorCountDetail: TriageAndErrorCountDetail;
// 	versionDurationStageDetail: DurationStageDetail;
// 	commitDurationStageDetail: DurationStageDetail;
// 	sortedViews: Array<SingleChartData>;
// 	isUrlParam: boolean;
// 	displayType: string;
// 	versionDurationRange: Array<string>;
// 	commitDurationRange: Array<string>;
// 	isFetchingReport: boolean;
// 	constructor(private triageService: TriageService, private route: ActivatedRoute, private location: Location) {
// 		super();
// 	}

// 	// ngOnInit() {
// 	// 	this.isUrlParam = false;
// 	// 	this.isFetchingReport = false;
// 	// 	this.displayType = "Regular";
// 	// 	this.reportType = ReportType[ReportType.Weekly];
// 	// 	this.reportTypes = Object.keys(ReportType).filter(t => typeof ReportType[t] === "number");
// 	// 	this.sortedViews = new Array<SingleChartData>();
// 	// 	this.triageViewSupervisors = new Array<TriageViewSupervisor>();
// 	// 	this.reportTimeSpans = new Array<string>();
// 	// 	this.summaryNumberCardChart = new NumberCardChart();
// 	// 	this.distributionPieChart = new AdvancedPieChart();
// 	// 	this.distributionTopTenVerticalBarChart = new VerticalBarChart();
// 	// 	this.versionDurationPieChart = new AdvancedPieChart();
// 	// 	this.versionDurationTopTenVerticalBarChart = new VerticalBarChart();
// 	// 	this.commitDurationPieChart = new AdvancedPieChart();
// 	// 	this.commitDurationTopTenVerticalBarChart = new VerticalBarChart();
// 	// 	this.totalLineChart = new LineChart();
// 	// 	this.triageAndErrorCountDetail = new TriageAndErrorCountDetail();
// 	// 	this.versionDurationStageDetail = new DurationStageDetail();
// 	// 	this.commitDurationStageDetail = new DurationStageDetail();
// 	// 	this.versionDurationRange = ["0~0", "0~0", "0~0"];
// 	// 	this.commitDurationRange = ["0~0", "0~0", "0~0"];

// 	// 	let reportTimeSpan = this.route.snapshot.paramMap.get("reportTimeSpan");
// 	// 	if (reportTimeSpan) {
// 	// 		this.isUrlParam = true;
// 	// 		reportTimeSpan = reportTimeSpan.replace(/_/g, "/");
// 	// 		reportTimeSpan = reportTimeSpan.replace("-", " - ");
// 	// 		this.logger.info("reportTimeSpanFromUrl", reportTimeSpan);
// 	// 		this.currentReportTimeSpan = reportTimeSpan;
// 	// 		this.currentRegularReportTimeSpan = reportTimeSpan;
// 	// 		this.triageService.getTriageReport(this.currentReportTimeSpan).subscribe(result => {
// 	// 			this.reportType = result.type;
// 	// 			this.getTriageReportTimeSpansByReportType(this.reportType, reportTimeSpan);
// 	// 		});
// 	// 	} else {
// 	// 		this.getTriageReportTimeSpansByReportType(this.reportType);
// 	// 	}
// 	// }

// //     //#region statistic charts
// //     //summart card chart
// // 	initSummaryNumberCardChart(triageReport: TriageReport) {
// // 		let colorDomain = new Array("#FFA1B5", "#a8385d", "#f2c385", "#6cc5a6", "#ed9a9a", "#3f8c85", "#1d627e");
// // 		this.summaryNumberCardChart = new NumberCardChart();
// // 		this.summaryNumberCardChart.scheme.domain = colorDomain;
// // 		this.summaryNumberCardChart.view = [1750, 300];
// // 		this.summaryNumberCardChart.cardColor = "rgba(204,228,232,0.3)";
// // 		let summaryData = new Array<SingleChartData>();
// // 		summaryData.push(new SingleChartData("TotalTriage", triageReport.triageReportSummary.triageTimes));
// // 		summaryData.push(new SingleChartData("TotalError", triageReport.triageReportSummary.errorTimes));
// // 		summaryData.push(new SingleChartData("FalseAlert", triageReport.triageReportSummary.falseAlertTimes));
// // 		summaryData.push(new SingleChartData("TrueAlert", triageReport.triageReportSummary.trueAlertTimes));
// // 		summaryData.push(
// // 			new SingleChartData(
// // 				"FalseAlertDuration",
// // 				Number(triageReport.triageReportSummary.averageFalseAlertDuration.toFixed(1))
// // 			)
// // 		);
// // 		summaryData.push(new SingleChartData("TopVersionDuration", Number(this.versionDurationRange[2].split("~")[1])));
// // 		summaryData.push(new SingleChartData("TopCommitDuration", Number(this.commitDurationRange[2].split("~")[1])));

// // 		this.summaryNumberCardChart.results = summaryData;
// // 	}

// // 	statusValueFormat(cardChartElement: any): string {
// // 		if (
// // 			cardChartElement.label == "FalseAlertDuration" ||
// // 			cardChartElement.label == "TopVersionDuration" ||
// // 			cardChartElement.label == "TopCommitDuration"
// // 		) {
// // 			return `${cardChartElement.value} hrs`;
// // 		} else {
// // 			return `${cardChartElement.value} times`;
// // 		}
// // 	}

// // 	//triage and error distribution
// // 	generateDistributionPieChartResult(triageReport: TriageReport) {
// // 		let singleChartDatas = new Array<SingleChartData>();
// // 		let viewSum = triageReport.triageReportSummary.triageStatisticsCount;
// // 		let triageAndErrorSum = triageReport.triageReportDetail.triageViewSupervisors.length;
// // 		let normalSum = viewSum - triageAndErrorSum;
// // 		let errorSum = 0;
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.triageAndErrorDistribution.totalErrorCount != 0) {
// // 				errorSum++;
// // 			}
// // 		});
// // 		this.triageAndErrorCountDetail = new TriageAndErrorCountDetail(
// // 			triageAndErrorSum - errorSum,
// // 			errorSum,
// // 			viewSum - triageAndErrorSum,
// // 			viewSum
// // 		);
// // 		singleChartDatas.push(new SingleChartData("triaged", this.triageAndErrorCountDetail.triageCount));
// // 		singleChartDatas.push(new SingleChartData("error", this.triageAndErrorCountDetail.errorCount));
// // 		singleChartDatas.push(new SingleChartData("normal", this.triageAndErrorCountDetail.normalCount));
// // 		return singleChartDatas;
// // 	}

// // 	initDistributionPieChart(triageReport: TriageReport) {
// // 		this.logger.info("initDistributionPieChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#FFA1B5", "#a8385d", "#e6ecef");
// // 		this.distributionPieChart = new AdvancedPieChart();
// // 		this.distributionPieChart.scheme.domain = colorDomain;
// // 		this.distributionPieChart.view = [700, 400];
// // 		this.distributionPieChart.animations = false;
// // 		this.distributionPieChart.results = this.generateDistributionPieChartResult(triageReport);
// // 	}

// // 	generatedistributionTopTenVerticalBarChartResult(triageReport: TriageReport) {
// // 		let singleChartDatas = new Array<SingleChartData>();
// // 		this.logger.info(
// // 			"triageReport.triageReportSummary.triageStatistics",
// // 			triageReport.triageReportSummary.triageStatistics
// // 		);
// // 		if (triageReport.triageReportSummary.triageStatistics.length == 0) {
// // 			singleChartDatas.push(new SingleChartData("none", 0));
// // 			return singleChartDatas;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.triageAndErrorDistribution.totalErrorCount + t.triageAndErrorDistribution.totalTriageCount != 0) {
// // 				singleChartDatas.push(
// // 					new SingleChartData(
// // 						t.entitySpaceViewName,
// // 						t.triageAndErrorDistribution.totalErrorCount + t.triageAndErrorDistribution.totalTriageCount
// // 					)
// // 				);
// // 			}
// // 		});
// // 		this.sortedViews = singleChartDatas.sort((a, b) => b.value - a.value);
// // 		singleChartDatas = singleChartDatas.sort((a, b) => b.value - a.value).slice(0, Constants.topTen);
// // 		return singleChartDatas;
// // 	}

// // 	initDistributionVerticalBarChart(triageReport: TriageReport) {
// // 		this.logger.info("initDistributionVerticalBarChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#FFA1B5");
// // 		this.distributionTopTenVerticalBarChart = new VerticalBarChart();
// // 		this.distributionTopTenVerticalBarChart.scheme.domain = colorDomain;
// // 		this.distributionTopTenVerticalBarChart.view = [970, 300];
// // 		this.distributionTopTenVerticalBarChart.showYAxisLabel = false;
// // 		this.distributionTopTenVerticalBarChart.legend = false;
// // 		this.distributionTopTenVerticalBarChart.showXAxisLabel = false;
// // 		this.distributionTopTenVerticalBarChart.animations = false;
// // 		this.distributionTopTenVerticalBarChart.results = this.generatedistributionTopTenVerticalBarChartResult(
// // 			triageReport
// // 		);
// // 	}

// // 	//version duration
// // 	generateVersionDurationPieChartResult(triageReport: TriageReport) {
// // 		let singleChartDatasOfChart = new Array<SingleChartData>();

// // 		let highDurationViews: number = 0;
// // 		let middleDurationViews: number = 0;
// // 		let lowDurationViews: number = 0;

// // 		let averageDuration: number = 0;
// // 		let averageDurationOfHigh: number = 0;
// // 		let averageDurationOfLow: number = 0;
// // 		let maxDurationOfAll: number = 0;
// // 		let minDurationOfAll: number = 10000;

// // 		let allViewVersionDurationsLength = triageReport.triageReportSummary.triageStatisticsCount;

// // 		let lowRange = new Array();
// // 		let middleRange = new Array();
// // 		let highRange = new Array();
// // 		if (allViewVersionDurationsLength == 0) {
// // 			singleChartDatasOfChart.push(new SingleChartData("none", 0));
// // 			return singleChartDatasOfChart;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.versionDuration.averageDuration == "NaN") {
// // 				t.versionDuration.averageDuration = "0";
// // 			}
// // 			averageDuration += Number(t.versionDuration.averageDuration) / allViewVersionDurationsLength;
// // 			if (Number(t.versionDuration.averageDuration) > maxDurationOfAll) {
// // 				maxDurationOfAll = Number(t.versionDuration.averageDuration);
// // 			}
// // 			if (Number(t.versionDuration.averageDuration) < minDurationOfAll) {
// // 				minDurationOfAll = Number(t.versionDuration.averageDuration);
// // 			}
// // 		});
// // 		averageDurationOfHigh = (averageDuration + maxDurationOfAll) / 2;
// // 		averageDurationOfLow = (averageDuration + minDurationOfAll) / 2;

// // 		lowRange = [minDurationOfAll.toFixed(1), averageDurationOfLow.toFixed(1)];
// // 		middleRange = [averageDurationOfLow.toFixed(1), averageDurationOfHigh.toFixed(1)];
// // 		highRange = [averageDurationOfHigh.toFixed(1), maxDurationOfAll.toFixed(1)];

// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.versionDuration.averageDuration == "NaN") {
// // 				t.versionDuration.averageDuration = "0";
// // 			}
// // 			if (
// // 				Number(t.versionDuration.averageDuration) <= maxDurationOfAll &&
// // 				Number(t.versionDuration.averageDuration) > averageDurationOfHigh
// // 			) {
// // 				highDurationViews++;
// // 			} else if (
// // 				Number(t.versionDuration.averageDuration) >= minDurationOfAll &&
// // 				Number(t.versionDuration.averageDuration) < averageDurationOfLow
// // 			) {
// // 				lowDurationViews++;
// // 			} else {
// // 				middleDurationViews++;
// // 			}
// // 		});
// // 		singleChartDatasOfChart = [
// // 			new SingleChartData("Low", lowDurationViews),
// // 			new SingleChartData("Middle", middleDurationViews),
// // 			new SingleChartData("High", highDurationViews)
// // 		];

// // 		this.versionDurationPieChart.pieChartDetailLayerValueDict.set("Low", lowRange);
// // 		this.versionDurationPieChart.pieChartDetailLayerValueDict.set("Middle", middleRange);
// // 		this.versionDurationPieChart.pieChartDetailLayerValueDict.set("High", highRange);
// // 		this.versionDurationStageDetail = new DurationStageDetail(
// // 			highDurationViews,
// // 			middleDurationViews,
// // 			lowDurationViews
// // 		);
// // 		this.versionDurationRange = [
// // 			lowRange[0] + "~" + lowRange[1],
// // 			middleRange[0] + "~" + middleRange[1],
// // 			highRange[0] + "~" + highRange[1]
// // 		];
// // 		return singleChartDatasOfChart;
// // 	}

// // 	initVersionDurationPieChart(triageReport: TriageReport) {
// // 		this.logger.info("initVersionDurationPieChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#d1f1ed", "#6dc8c0", "#3f8c85");
// // 		this.versionDurationPieChart = new AdvancedPieChart();
// // 		this.versionDurationPieChart.scheme.domain = colorDomain;
// // 		this.versionDurationPieChart.view = [700, 400];
// // 		this.versionDurationPieChart.animations = false;
// // 		this.versionDurationPieChart.results = this.generateVersionDurationPieChartResult(triageReport);
// // 	}

// // 	generateVersionDurationTopTenVerticalBarChartResult(triageReport: TriageReport) {
// // 		let singleChartDatas = new Array<SingleChartData>();
// // 		if (triageReport.triageReportSummary.triageStatistics.length == 0) {
// // 			singleChartDatas.push(new SingleChartData("none", 0));
// // 			return singleChartDatas;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			singleChartDatas.push(
// // 				new SingleChartData(t.entitySpaceViewName, Number(Number(t.versionDuration.averageDuration).toFixed(1)))
// // 			);
// // 		});
// // 		singleChartDatas = singleChartDatas.sort((a, b) => b.value - a.value).slice(0, Constants.topTen);
// // 		return singleChartDatas;
// // 	}

// // 	initVersionDurationVerticalBarChart(triageReport: TriageReport) {
// // 		this.logger.info("initVersionDurationVerticalBarChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#6dc8c0");
// // 		this.versionDurationTopTenVerticalBarChart = new VerticalBarChart();
// // 		this.versionDurationTopTenVerticalBarChart.scheme.domain = colorDomain;
// // 		this.versionDurationTopTenVerticalBarChart.view = [970, 300];
// // 		this.versionDurationTopTenVerticalBarChart.legend = false;
// // 		this.versionDurationTopTenVerticalBarChart.showXAxisLabel = false;
// // 		this.versionDurationTopTenVerticalBarChart.showYAxisLabel = false;
// // 		this.versionDurationTopTenVerticalBarChart.animations = false;
// // 		this.versionDurationTopTenVerticalBarChart.results = this.generateVersionDurationTopTenVerticalBarChartResult(
// // 			triageReport
// // 		);
// // 	}

// // 	//commit duration
// // 	generateCommitDurationPieChartResult(triageReport: TriageReport) {
// // 		let singleChartDatasOfChart = new Array<SingleChartData>();

// // 		let highDurationViews: number = 0;
// // 		let middleDurationViews: number = 0;
// // 		let lowDurationViews: number = 0;

// // 		let averageDuration: number = 0;
// // 		let averageDurationOfHigh: number = 0;
// // 		let averageDurationOfLow: number = 0;
// // 		let maxDurationOfAll: number = 0;
// // 		let minDurationOfAll: number = 10000;

// // 		let allViewtriageCommitDurationsLength = triageReport.triageReportSummary.triageStatisticsCount;

// // 		let lowRange = new Array();
// // 		let middleRange = new Array();
// // 		let highRange = new Array();
// // 		if (allViewtriageCommitDurationsLength == 0) {
// // 			singleChartDatasOfChart.push(new SingleChartData("none", 0));
// // 			return singleChartDatasOfChart;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.triageCommitDuration.averageDuration == "NaN") {
// // 				t.triageCommitDuration.averageDuration = "0";
// // 			}
// // 			averageDuration += Number(t.triageCommitDuration.averageDuration) / allViewtriageCommitDurationsLength;
// // 			if (Number(t.triageCommitDuration.averageDuration) > maxDurationOfAll) {
// // 				maxDurationOfAll = Number(t.triageCommitDuration.averageDuration);
// // 			}
// // 			if (Number(t.triageCommitDuration.averageDuration) < minDurationOfAll) {
// // 				minDurationOfAll = Number(t.triageCommitDuration.averageDuration);
// // 			}
// // 		});
// // 		averageDurationOfHigh = (averageDuration + maxDurationOfAll) / 2;
// // 		averageDurationOfLow = (averageDuration + minDurationOfAll) / 2;

// // 		lowRange = [minDurationOfAll.toFixed(1), averageDurationOfLow.toFixed(1)];
// // 		middleRange = [averageDurationOfLow.toFixed(1), averageDurationOfHigh.toFixed(1)];
// // 		highRange = [averageDurationOfHigh.toFixed(1), maxDurationOfAll.toFixed(1)];

// // 		this.logger.info("lowRange", lowRange);
// // 		this.logger.info("middleRange", middleRange);
// // 		this.logger.info("highRange", highRange);
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.triageCommitDuration.averageDuration == "NaN") {
// // 				t.triageCommitDuration.averageDuration = "0";
// // 			}
// // 			if (
// // 				Number(t.triageCommitDuration.averageDuration) <= maxDurationOfAll &&
// // 				Number(t.triageCommitDuration.averageDuration) > averageDurationOfHigh
// // 			) {
// // 				highDurationViews++;
// // 			} else if (
// // 				Number(t.triageCommitDuration.averageDuration) >= minDurationOfAll &&
// // 				Number(t.triageCommitDuration.averageDuration) < averageDurationOfLow
// // 			) {
// // 				lowDurationViews++;
// // 			} else {
// // 				middleDurationViews++;
// // 			}
// // 		});
// // 		singleChartDatasOfChart = [
// // 			new SingleChartData("Low", lowDurationViews),
// // 			new SingleChartData("Middle", middleDurationViews),
// // 			new SingleChartData("High", highDurationViews)
// // 		];

// // 		this.commitDurationPieChart.pieChartDetailLayerValueDict.set("Low", lowRange);
// // 		this.commitDurationPieChart.pieChartDetailLayerValueDict.set("Middle", middleRange);
// // 		this.commitDurationPieChart.pieChartDetailLayerValueDict.set("High", highRange);
// // 		this.commitDurationStageDetail = new DurationStageDetail(
// // 			highDurationViews,
// // 			middleDurationViews,
// // 			lowDurationViews
// // 		);
// // 		this.commitDurationRange = [
// // 			lowRange[0] + "~" + lowRange[1],
// // 			middleRange[0] + "~" + middleRange[1],
// // 			highRange[0] + "~" + highRange[1]
// // 		];
// // 		return singleChartDatasOfChart;
// // 	}

// // 	initCommitDurationPieChart(triageReport: TriageReport) {
// // 		this.logger.info("initCommitDurationPieChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#c6efff", "#389ec5", "#1d627e");
// // 		this.commitDurationPieChart = new AdvancedPieChart();
// // 		this.commitDurationPieChart.scheme.domain = colorDomain;
// // 		this.commitDurationPieChart.view = [700, 400];
// // 		this.commitDurationPieChart.animations = false;
// // 		this.commitDurationPieChart.results = this.generateCommitDurationPieChartResult(triageReport);
// // 	}

// // 	generateCommitDurationTopTenVerticalBarChartResult(triageReport: TriageReport) {
// // 		let singleChartDatas = new Array<SingleChartData>();
// // 		if (triageReport.triageReportSummary.triageStatistics.length == 0) {
// // 			singleChartDatas.push(new SingleChartData("none", 0));
// // 			return singleChartDatas;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			singleChartDatas.push(
// // 				new SingleChartData(
// // 					t.entitySpaceViewName,
// // 					Number(Number(t.triageCommitDuration.averageDuration).toFixed(1))
// // 				)
// // 			);
// // 		});
// // 		singleChartDatas = singleChartDatas.sort((a, b) => b.value - a.value).slice(0, Constants.topTen);
// // 		return singleChartDatas;
// // 	}

// // 	initCommitDurationVerticalBarChart(triageReport: TriageReport) {
// // 		this.logger.info("initCommitDurationVerticalBarChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#389ec5");
// // 		this.commitDurationTopTenVerticalBarChart = new VerticalBarChart();
// // 		this.commitDurationTopTenVerticalBarChart.scheme.domain = colorDomain;
// // 		this.commitDurationTopTenVerticalBarChart.view = [970, 300];
// // 		this.commitDurationTopTenVerticalBarChart.legend = false;
// // 		this.commitDurationTopTenVerticalBarChart.showXAxisLabel = false;
// // 		this.commitDurationTopTenVerticalBarChart.showYAxisLabel = false;
// // 		this.commitDurationTopTenVerticalBarChart.animations = false;
// // 		this.commitDurationTopTenVerticalBarChart.results = this.generateCommitDurationTopTenVerticalBarChartResult(
// // 			triageReport
// // 		);
// // 	}

// // 	generateTotalLineChartResult(triageReport: TriageReport) {
// // 		let dailyCounts = new Array<DailyCount>();
// // 		let multiChartData: MultiChartData = new MultiChartData();
// // 		let multiChartDatas = new Array<MultiChartData>();
// // 		let errorTriageViewNames = new Array<DailyErrorTriageViewName>();
// // 		if (triageReport.triageReportSummary.triageStatistics.length == 0) {
// // 			multiChartDatas.push(new MultiChartData("none", [new SingleChartData("none", 0)]));
// // 			this.totalLineChart.lineChartDetailDict.set(multiChartDatas[0].name + "none", new Set<string>());
// // 			return multiChartDatas;
// // 		}
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			t.triageAndErrorDistribution.triageAndErrors.forEach(e => {
// // 				dailyCounts.push(new DailyCount(t.entitySpaceViewName, e.date, e.errorCount, e.triageCount));
// // 			});
// // 		});
// // 		multiChartDatas[0] = new MultiChartData("error");
// // 		multiChartDatas[1] = new MultiChartData("triage");
// // 		if (dailyCounts.length == 0) {
// // 			multiChartDatas[0] = new MultiChartData("no error", [new SingleChartData("none", 0)]);
// // 			multiChartDatas[1] = new MultiChartData("no triage", [new SingleChartData("none", 0)]);
// // 		}
// // 		dailyCounts.forEach(d => {
// // 			for (let i = 0; i < Constants.monthDays; i++) {
// // 				if (!multiChartDatas[0].series[i]) {
// // 					multiChartDatas[0].series[i] = new SingleChartData(d.date, d.errorCount);
// // 					multiChartDatas[1].series[i] = new SingleChartData(d.date, d.triageCount);
// // 					errorTriageViewNames[i] = new DailyErrorTriageViewName(d.date);
// // 					if (d.errorCount > 0) {
// // 						errorTriageViewNames[i].errorViewNames.add(d.viewName);
// // 					}
// // 					if (d.triageCount > 0) {
// // 						errorTriageViewNames[i].triageViewNames.add(d.viewName);
// // 					}
// // 					break;
// // 				} else if (multiChartDatas[0].series[i].name == d.date) {
// // 					if (d.errorCount > 0) {
// // 						multiChartDatas[0].series[i].value++;
// // 						errorTriageViewNames[i].errorViewNames.add(d.viewName);
// // 					}
// // 					if (d.triageCount > 0) {
// // 						multiChartDatas[1].series[i].value++;
// // 						errorTriageViewNames[i].triageViewNames.add(d.viewName);
// // 					}
// // 					break;
// // 				}
// // 			}
// // 		});
// // 		errorTriageViewNames.forEach(e => {
// // 			this.totalLineChart.lineChartDetailDict.set(e.date + "error", e.errorViewNames);
// // 			this.totalLineChart.lineChartDetailDict.set(e.date + "triage", e.triageViewNames);
// // 		});
// // 		return multiChartDatas;
// // 	}

// // 	initTotalLineChart(triageReport: TriageReport) {
// // 		this.logger.info("initTotalLineChart", triageReport.reportTimeSpan);
// // 		let colorDomain = new Array("#a8385d", "#FFA1B5");
// // 		this.totalLineChart = new LineChart();
// // 		this.totalLineChart.scheme.domain = colorDomain;
// // 		this.totalLineChart.view = [1700, 400];
// // 		this.totalLineChart.results = this.generateTotalLineChartResult(triageReport);
// // 	}
// // 	//#endregion

// // 	//#region detail
// // 	initViewDetail(triageReport: TriageReport) {
// // 		let sortedTriageViewSupervisors = new Array<TriageViewSupervisor>();
// // 		this.triageViewSupervisors = new Array<TriageViewSupervisor>();
// // 		triageReport.triageReportDetail.triageViewSupervisors.forEach(t => {
// // 			this.addTriageView(t);
// // 		});
// // 		this.logger.info("unorder", this.triageViewSupervisors);
// // 		for (let i = 0; i < this.sortedViews.length; i++) {
// // 			this.triageViewSupervisors.forEach(t => {
// // 				if (t.entitySpaceViewName == this.sortedViews[i].name) {
// // 					sortedTriageViewSupervisors.push(t);
// // 				}
// // 			});
// // 		}
// // 		this.triageViewSupervisors = sortedTriageViewSupervisors;
// // 		this.logger.info("ordered", this.triageViewSupervisors);
// // 		this.logger.info("order", this.sortedViews);
// // 	}

// // 	addTriageView(triageViewSupervisor: TriageViewSupervisor) {
// // 		this.triageViewSupervisors.push(
// // 			new TriageViewSupervisor(
// // 				triageViewSupervisor.id,
// // 				triageViewSupervisor.triageAnalysisId,
// // 				triageViewSupervisor.customerId,
// // 				triageViewSupervisor.customerEnv,
// // 				triageViewSupervisor.entitySpaceName,
// // 				triageViewSupervisor.entitySpaceViewName,
// // 				triageViewSupervisor.segment,
// //                 triageViewSupervisor.currentState,
// //                 triageViewSupervisor.originalState,
// // 				triageViewSupervisor.latestVersion,
// // 				triageViewSupervisor.latestVersionState,
// // 				triageViewSupervisor.latestCompletedVersion,
// // 				triageViewSupervisor.latestCompletedVersionState,
// //                 triageViewSupervisor.latestSucceedTime,
// //                 triageViewSupervisor.latestVersionLatency,
// //                 triageViewSupervisor.latestSucceedVersionLatency,
// // 				triageViewSupervisor.latestStandardVersion,
// // 				triageViewSupervisor.latestJobType,
// // 				triageViewSupervisor.deletedCount,
// // 				triageViewSupervisor.addedCount,
// // 				triageViewSupervisor.churnedCount,
// // 				triageViewSupervisor.owner,
// // 				triageViewSupervisor.tfsUrl
// // 			)
// // 		);
// // 	}

// // 	getViewStatistic(id: number, triageReport: TriageReport) {
// // 		let triageStatistic = new TriageStatistic();
// // 		triageReport.triageReportSummary.triageStatistics.forEach(t => {
// // 			if (t.supervisorId == id) {
// // 				triageStatistic = t;
// // 			}
// // 		});
// // 		return triageStatistic;
// // 	}

// // 	expandStatistic(triageViewSupervisor: TriageViewSupervisor) {
// // 		triageViewSupervisor.expandStatistic = !triageViewSupervisor.expandStatistic;
// // 		if (triageViewSupervisor.expandStatistic && triageViewSupervisor.versionDelayLineChart.results.length == 0) {
// // 			this.triageService.getTriageReport(this.currentReportTimeSpan).subscribe(result => {
// // 				let viewStatistic = this.getViewStatistic(triageViewSupervisor.id, result);
// // 				triageViewSupervisor.getVersionDelayLineChart(viewStatistic.versionDuration);
// // 				triageViewSupervisor.getVersionDelayStackedVerticalBarChart(viewStatistic.versionDuration);
// // 				triageViewSupervisor.getCommitDelayLineChart(viewStatistic.triageCommitDuration);
// // 				triageViewSupervisor.getMonthlyCountLineChart(viewStatistic.triageAndErrorDistribution);
// // 			});
// // 		}
// // 	}
// // 	//#endregion

// //     //#region get report
// // 	changeReportTimeSpan(reportTimeSpan: string) {
// // 		this.currentReportTimeSpan = reportTimeSpan;
// // 		this.currentRegularReportTimeSpan = this.currentReportTimeSpan;
// // 		this.generateTriageReport(reportTimeSpan);
// // 		this.logger.info("changeReportTimeSpan", this.currentReportTimeSpan);
// // 	}

// // 	getLastSeveraldayReport(daysCount: number) {
// // 		let today = new Date();
// // 		let utcTodayTime = Date.UTC(
// // 			today.getUTCFullYear(),
// // 			today.getUTCMonth(),
// // 			today.getUTCDate(),
// // 			today.getUTCHours(),
// // 			today.getUTCMinutes(),
// // 			today.getUTCSeconds()
// // 		);
// // 		let pastDayTime = utcTodayTime - 1000 * 60 * 60 * 24 * daysCount; //1,000 ms * 60 s * 60 mins * 24 hrs * daysCount
// // 		let pastDay = new Date(pastDayTime);
// // 		this.startDate = {
// // 			date: {
// // 				year: pastDay.getUTCFullYear(),
// // 				month: Number(pastDay.getUTCMonth() + 1),
// // 				day: pastDay.getUTCDate()
// // 			}
// // 		};
// // 		this.endDate = {
// // 			date: { year: today.getUTCFullYear(), month: Number(today.getUTCMonth() + 1), day: today.getUTCDate() }
// // 		};
// // 		this.generateCustomizedTriageReport();
// // 	}

// // 	compareTimeSpan(timeSpan1: string, timeSpan2: string) {
// // 		let startTime1 = timeSpan1.split(" - ")[0];
// // 		let startTimeArray1 = startTime1.split("/");
// // 		let startTimeNum1 =
// // 			parseInt(startTimeArray1[2]) * 10000 + parseInt(startTimeArray1[0]) * 100 + parseInt(startTimeArray1[1]);
// // 		let startTime2 = timeSpan2.split(" - ")[0];
// // 		let startTimeArray2 = startTime2.split("/");
// // 		let startTimeNum2 =
// // 			parseInt(startTimeArray2[2]) * 10000 + parseInt(startTimeArray2[0]) * 100 + parseInt(startTimeArray2[1]);
// // 		return startTimeNum2 - startTimeNum1;
// // 	}

// // 	getTriageReportTimeSpansByReportType(reportType: string, reportTimeSpan?: string) {
// // 		this.triageService.getTriageReportTimeSpansByReportType(reportType).subscribe(result => {
// // 			this.reportTimeSpans = result.sort((a, b) => {
// // 				return this.compareTimeSpan(a, b);
// // 			});
// // 			if (this.reportTimeSpans.length != 0) {
// //                 //if there is a param form url, generate report of this param
// // 				let initReportTimeSpan = reportTimeSpan == null ? this.reportTimeSpans[0] : reportTimeSpan;
// // 				this.changeReportTimeSpan(initReportTimeSpan);
// // 			}
// // 			this.reportType = reportType;
// // 		});
// // 	}

// // 	generateCustomizedTriageReport() {
// //         this.isFetchingReport = true;
// //         //report timespan format: month/day/year
// // 		let startDate: string =
// // 			this.startDate.date.month + "/" + this.startDate.date.day + "/" + this.startDate.date.year;
// // 		let endDate: string = this.endDate.date.month + "/" + this.endDate.date.day + "/" + this.endDate.date.year;
// // 		this.currentReportTimeSpan = startDate + " - " + endDate;
// // 		this.generateTriageReport(this.currentReportTimeSpan);
// // 	}

// // 	generateRegularTriageReport() {
// // 		this.currentReportTimeSpan = this.currentRegularReportTimeSpan;
// // 		this.generateTriageReport(this.currentReportTimeSpan);
// // 	}

// // 	generateTriageReport(reportTimeSpan: string) {
// // 		this.triageService.getTriageReport(reportTimeSpan).subscribe(result => {
// // 			this.initCharts(result);
// // 			this.isFetchingReport = false;
// // 			this.changeUrl();
// // 			this.logger.info("current report", result);
// // 		});
// // 		this.logger.info("generateTriageReport", this.currentReportTimeSpan);
// // 	}

// // 	initCharts(result: TriageReport) {
// // 		this.initDistributionPieChart(result);
// // 		this.initDistributionVerticalBarChart(result);
// // 		this.initVersionDurationPieChart(result);
// // 		this.initVersionDurationVerticalBarChart(result);
// // 		this.initCommitDurationPieChart(result);
// // 		this.initCommitDurationVerticalBarChart(result);
// // 		this.initSummaryNumberCardChart(result);
// // 		this.initViewDetail(result);
// // 		this.initTotalLineChart(result);
// //     }
    
// //     changeUrl() {
// // 		//change the url without redirction
// // 		if (this.isUrlParam) {
// // 			let urlReportTimeSpan = this.currentReportTimeSpan.replace(new RegExp("/", "g"), "_");
// // 			urlReportTimeSpan = urlReportTimeSpan.replace(" - ", "-");
// // 			this.location.replaceState("triage/report/" + urlReportTimeSpan);
// // 		}
// // 		this.isUrlParam = true;
// //     }
// //     //#endregion
    
// //     //#region scroll
// // 	scrollToViewDetail(event: any) {
// // 		let id: number = 0;
// // 		let index: number = 0;
// // 		this.triageViewSupervisors.forEach((t, i) => {
// // 			if (t.entitySpaceViewName == event.name) {
// // 				id = t.id;
// // 				index = i;
// // 				this.expandStatistic(t);
// // 			} else {
// // 				t.expandStatistic = false;
// // 			}
// // 		});

// // 		let viewTableHeight = this.viewTable.nativeElement.offsetTop + 20;
// // 		viewTableHeight = viewTableHeight + index * 40;
// // 		window.scrollTo(0, viewTableHeight);
// // 	}

// // 	summaryCardScrollToDetail(event: any) {
// // 		let topVersionDurationHeight = this.topVersionDuration.nativeElement.offsetTop;
// // 		let topCommitDurationHeight = this.topCommitDuration.nativeElement.offsetTop;
// // 		if (event.name == "TopVersionDuration") {
// // 			window.scrollTo(0, topVersionDurationHeight);
// // 		} else if (event.name == "TopCommitDuration") {
// // 			window.scrollTo(0, topCommitDurationHeight);
// // 		}
// // 	}
// //     //#endregion

// //     //#region get previous and get next report
// //     getPreReport() {
// // 		let index: number = 0;
// // 		for (let i = 0; i < this.reportTimeSpans.length; i++) {
// // 			if (this.reportTimeSpans[i] == this.currentRegularReportTimeSpan) {
// // 				index = i;
// // 			}
// // 		}
// // 		index = index == this.reportTimeSpans.length - 1 ? 0 : index + 1;
// // 		this.changeReportTimeSpan(this.reportTimeSpans[index]);
// //     }
    
// // 	getNextReport() {
// // 		let index: number = 0;
// // 		for (let i = 0; i < this.reportTimeSpans.length; i++) {
// // 			if (this.reportTimeSpans[i] == this.currentRegularReportTimeSpan) {
// // 				index = i;
// // 			}
// // 		}
// // 		index = index == 0 ? 0 : index - 1;
// // 		this.changeReportTimeSpan(this.reportTimeSpans[index]);
// //     }
// //     //#endregion
// }
