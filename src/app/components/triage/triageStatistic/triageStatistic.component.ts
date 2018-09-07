import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { TriageService } from "../triage.service";
import { BaseComponent } from "../../common/base.component";
import {
	AdvancedPieChart,
	SingleChartData,
	VerticalBarChart,
	GroupedVerticalBarChart,
	LineChart,
	MultiChartData,
    PieGridChart
} from "../../../core/plugin/ngxChart";
import { HttpClient } from "@angular/common/http";
import { Constants } from "../../../core/common/constants";
import { TriageAndErrorDistribution, DailyCount, DailyErrorTriageViewName, ViewVersionDuration, ViewStateDistribution } from "../../../core/triage/triageStatistic";

@Component({
	selector: "triage-statistic",
	templateUrl: "./triageStatistic.component.html",
	styleUrls: []
})
export class TriageStatisticComponent extends BaseComponent implements OnInit {
    distributionPieChart: AdvancedPieChart;
    versionDelayDistributionPieGridChart: PieGridChart;
    currentViewStateDistributionPieGridChart: PieGridChart;
    originalViewStateDistributionPieGridChart: PieGridChart;
	triageTopTenBarChart: VerticalBarChart;
	weeklyCountLineChart: LineChart;
    monthlyCountLineChart: LineChart;
	//pieChartStateDistributionData: Array<PieChartData>;
    scheme: object;
	constructor(private triageService: TriageService) {
        super();
	}

	ngOnInit() {
		this.initRealTimePieChart();
		this.initTopTenVerticalBarChart();
        this.initCurrentViewStateDistributionPieGridChart();
        this.initOriginalViewStateDistributionPieGridChart();
		this.initVersionDelayDistributionPieGridChart();
		this.initMonthlyCountLineChart();
	}

	initRealTimePieChart() {
		//this.pieChartStateDistributionData = new Array<PieChartData>();
		//Errored, Triaged, updating, standard
		let colorDomain = new Array("#a8385d", "#FFA1B5", "#86C7F3", "#5aa454");
		this.distributionPieChart = new AdvancedPieChart();
		this.distributionPieChart.scheme.domain = colorDomain;
		//this.distributionPieChart.scheme.domain = colorScheme;
		this.logger.info(this.distributionPieChart);
		this.triageService
			.getEntitySpaceViewStateDistribution()
			.subscribe(entitySpaceViewStateDistributions => {
				this.logger.info(entitySpaceViewStateDistributions);
				this.distributionPieChart.results = entitySpaceViewStateDistributions.map(
					t =>
						new SingleChartData(
							this.EntitySpaceViewVersionState[t.state],
							t.count
						)
				);
				this.logger.info(
					"realtimechart",
					this.distributionPieChart.results
				);
			});

		//this.getEntitySpaceViewStateDistribution();
    }
    
    generateViewStateDistributionPieGridChartResult(viewStateDistributions:Array<ViewStateDistribution>){
        return viewStateDistributions.map(
            t =>
                new SingleChartData(
                    this.EntitySpaceViewState[t.state],
                    t.count
                )
        );
    }

    initCurrentViewStateDistributionPieGridChart(){
        let colorDomain = new Array("#d1f1ed", "#6dc8c0", "#3f8c85", "#5aa454");
        this.currentViewStateDistributionPieGridChart = new PieGridChart();
        this.currentViewStateDistributionPieGridChart.view = [700,200];
		this.currentViewStateDistributionPieGridChart.scheme.domain = colorDomain;
		this.triageService.getViewStateDistribution().subscribe(viewStateDistributions => {
                this.currentViewStateDistributionPieGridChart.results = 
                this.generateViewStateDistributionPieGridChartResult(viewStateDistributions.currentViewStateDistribution);
		});
    }

    initOriginalViewStateDistributionPieGridChart(){
        let colorDomain = new Array("#c6efff", "#389ec5", "#1d627e", "#86c7f3");
        this.originalViewStateDistributionPieGridChart = new PieGridChart();
        this.originalViewStateDistributionPieGridChart.view = [700,200];
		this.originalViewStateDistributionPieGridChart.scheme.domain = colorDomain;
		this.triageService.getViewStateDistribution().subscribe(viewStateDistributions => {
                this.originalViewStateDistributionPieGridChart.results = 
                this.generateViewStateDistributionPieGridChartResult(viewStateDistributions.originalViewStateDistribution);
        });			
    }

	generateTopTenVerticalBarChartResult(
		triageAndErrorDistributions: TriageAndErrorDistribution[]
	) {
        let singleChartDatas = new Array<SingleChartData>();
        if(triageAndErrorDistributions.length==0){
            singleChartDatas.push(new SingleChartData("none",0));
            return singleChartDatas;
        }
		triageAndErrorDistributions.forEach(t => {
			singleChartDatas.push(
				new SingleChartData(
					t.viewName,
					t.totalTriageCount + t.totalErrorCount
                )
            );
		});
		singleChartDatas = singleChartDatas
			.sort((a, b) => b.value - a.value)
			.slice(0, Constants.topTen);
		return singleChartDatas;
	}

	initTopTenVerticalBarChart() {
		let colorDomain = new Array("#FFA1B5");
        this.triageTopTenBarChart = new VerticalBarChart();
        this.triageTopTenBarChart.legend=false;
		this.triageTopTenBarChart.scheme.domain = colorDomain;
		this.triageService
			.getTriageAndErrorDistributionResult()
			.subscribe(result => {
				this.triageTopTenBarChart.results = this.generateTopTenVerticalBarChartResult(
					result
				);
				this.logger.info(
					"TopTenVerticalBarChart",
					this.triageTopTenBarChart.results
				);
            }); 
	}

    generateVersionDelayDistributionPieGridChartResult(allViewVersionDurations:ViewVersionDuration[]) {
        let singleChartDatasOfChart = new Array<SingleChartData>();

        let highDurationViews = new Array<SingleChartData>();
        let middleDurationViews = new Array<SingleChartData>();
        let lowDurationViews = new Array<SingleChartData>();

        let averageDuration:number = 0;
        let averageDurationOfHigh:number = 0;
        let averageDurationOfLow:number = 0;
        let maxDurationOfAll:number = 0;
        let minDurationOfAll:number = 10000;

        let allViewVersionDurationsLength=allViewVersionDurations.length;

        let lowRange = new Array();
        let middleRange = new Array();
        let highRange = new Array();
        if(allViewVersionDurationsLength==0){
            singleChartDatasOfChart.push(new SingleChartData("none",0));
            return singleChartDatasOfChart;
        }
		allViewVersionDurations.forEach(t => {
            if(t.averageDuration=="NaN"){
                t.averageDuration="0";
            }
            averageDuration+=(Number(t.averageDuration)/allViewVersionDurationsLength);
            if(Number(t.averageDuration) > maxDurationOfAll){
                maxDurationOfAll = Number(t.averageDuration);
            }
            if(Number(t.averageDuration) < minDurationOfAll){
                minDurationOfAll = Number(t.averageDuration);
            }
        });
        averageDurationOfHigh=(averageDuration+maxDurationOfAll)/2;
        averageDurationOfLow=(averageDuration+minDurationOfAll)/2;

        lowRange=[minDurationOfAll.toFixed(1),averageDurationOfLow.toFixed(1)];
        middleRange=[averageDurationOfLow.toFixed(1),averageDurationOfHigh.toFixed(1)];
        highRange=[averageDurationOfHigh.toFixed(1),maxDurationOfAll.toFixed(1)];

        allViewVersionDurations.forEach(t => {
            if(t.averageDuration=="NaN"){
                t.averageDuration="0";
            }
            if(Number(t.averageDuration)<=maxDurationOfAll&&Number(t.averageDuration)>averageDurationOfHigh){
                highDurationViews.push(new SingleChartData(t.viewName,Number(Number(t.averageDuration).toFixed(1))));
            }
            else if(Number(t.averageDuration)>=minDurationOfAll&&Number(t.averageDuration)<averageDurationOfLow){
                lowDurationViews.push(new SingleChartData(t.viewName,Number(Number(t.averageDuration).toFixed(1))));
            }
            else{
                middleDurationViews.push(new SingleChartData(t.viewName,Number(Number(t.averageDuration).toFixed(1))));
            }
        });
        singleChartDatasOfChart=[
            new SingleChartData("Low",lowDurationViews.length),
            new SingleChartData("Middle",middleDurationViews.length),
            new SingleChartData("High",highDurationViews.length)
        ];

        highDurationViews=highDurationViews.sort((a,b)=>b.value-a.value).slice(0,Constants.topFive);//sort from high to low
        lowDurationViews=lowDurationViews.sort((a,b)=>a.value-b.value).slice(0,Constants.topFive);//sort from low to high
        middleDurationViews=middleDurationViews.sort((a,b)=>b.value-a.value).slice(0,Constants.topFive);//sort from high to low

        this.versionDelayDistributionPieGridChart.pieGridChartDetailDict.set("Low",lowDurationViews);
        this.versionDelayDistributionPieGridChart.pieGridChartDetailDict.set("Middle",middleDurationViews);
        this.versionDelayDistributionPieGridChart.pieGridChartDetailDict.set("High",highDurationViews);

        this.versionDelayDistributionPieGridChart.pieGridChartDetailLayerValueDict.set("Low",lowRange);
        this.versionDelayDistributionPieGridChart.pieGridChartDetailLayerValueDict.set("Middle",middleRange);
        this.versionDelayDistributionPieGridChart.pieGridChartDetailLayerValueDict.set("High",highRange);
		return singleChartDatasOfChart;
	}


	initVersionDelayDistributionPieGridChart() {
		let colorDomain = new Array("#86C7F3", "#FFA1B5", "#a8385d");
        this.versionDelayDistributionPieGridChart = new PieGridChart();
        this.triageService.getAllViewVersionDelaysResult().subscribe(result=>{
            this.versionDelayDistributionPieGridChart.results=this.generateVersionDelayDistributionPieGridChartResult(result);
        })
		this.versionDelayDistributionPieGridChart.scheme.domain = colorDomain;
	}

	// getEntitySpaceViewStateDistribution() {
	//     let pieChartStateDistributionData: Array<PieChartData>;
	// 	this.triageService
	// 		.getEntitySpaceViewStateDistribution()
	// 		.subscribe(entitySpaceViewStateDistributions => {
	// 			pieChartStateDistributionData = entitySpaceViewStateDistributions.map(
	// 				t => t.ToPieChartData()
	// 			);
	//         });
	//     return pieChartStateDistributionData;
	// }

	generateMonthlyCountLineChartResult(
		triageAndErrorDistributions: TriageAndErrorDistribution[]
	) {
		let dailyCounts = new Array<DailyCount>();
		let multiChartData: MultiChartData = new MultiChartData();
        let multiChartDatas = new Array<MultiChartData>();
        if(triageAndErrorDistributions.length==0){
            multiChartDatas.push(new MultiChartData("none",[new SingleChartData("none",0)]));
            return multiChartDatas;
        }
		triageAndErrorDistributions.forEach(t => {
			t.triageAndErrors.forEach(e => {
				dailyCounts.push(
					new DailyCount(
						t.viewName,
						e.date,
						e.errorCount,
						e.triageCount
					)
				);
			});
		});
		multiChartDatas[0] = new MultiChartData("error");
        multiChartDatas[1] = new MultiChartData("triage");
        if(dailyCounts.length==0){
            multiChartDatas[0]=new MultiChartData("no error",[new SingleChartData("none",0)]);
            multiChartDatas[1]=new MultiChartData("no triage",[new SingleChartData("none",0)]);
        }
		dailyCounts.forEach(d => {
			for (let i = 0; i < Constants.monthDays; i++) {
				if (!multiChartDatas[0].series[i]) {
					multiChartDatas[0].series[i] = new SingleChartData(
						d.date,
						d.errorCount
					);
					multiChartDatas[1].series[i] = new SingleChartData(
						d.date,
						d.triageCount
					);
					break;
				} else if (multiChartDatas[0].series[i].name == d.date) {
					multiChartDatas[0].series[i].value +=
						d.errorCount > 0 ? 1 : 0;
					multiChartDatas[1].series[i].value +=
						d.triageCount > 0 ? 1 : 0;
					break;
				}
			}
		});
		return multiChartDatas;
	}

	initMonthlyCountLineChart() {
		let colorDomain = new Array("#a8385d", "#FFA1B5", "#86C7F3", "#5aa454");
		this.monthlyCountLineChart = new LineChart();
		this.monthlyCountLineChart.view = [1700, 400];
        this.monthlyCountLineChart.scheme.domain = colorDomain;
		this.triageService
			.getTriageAndErrorDistributionResult()
			.subscribe(result => {
				this.monthlyCountLineChart.results = this.generateMonthlyCountLineChartResult(result);
				this.logger.info(
					"monthlyCountLineChart",
					this.monthlyCountLineChart.results
				);
			});
	}
}
