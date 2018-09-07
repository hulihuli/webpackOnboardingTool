import { Component, OnInit, Input } from '@angular/core'
import { BaseComponent } from '../../components/common/base.component';
import { TriageViewSupervisor } from '../../core/triage/triageViewSupervisor';
import { TriageService } from '../../components/triage/triage.service';
import { MultiChartData } from '../../core/plugin/ngxChart';

@Component({
	selector: "triage-view-statistic",
	templateUrl: "./viewStatisticPanel.component.html",
	styles: []
})
export class ViewStatisticPanelComponent extends BaseComponent implements OnInit {
	@Input() triageViewSupervisor: TriageViewSupervisor;

    displayType: string;
	constructor(private triageService: TriageService) {
		super();
	}

	ngOnInit() {
        this.displayType = "displayBoth";
    }
    
    generateVersionDelayStackedVerticalBarChartResultFakeTriageOnly(ChartResults: Array<MultiChartData>) {
        ChartResults.forEach(version=>{
            if(version.series.length!=0&&!(version.series[3].value!=0&&version.series[2].value!=0)){
                version.series.forEach(t=>{
                    t.value=0;
                });
            }
        });
        console.log("fake only",ChartResults)
        return ChartResults
    }

    generateVersionDelayStackedVerticalBarChartResultTrueTriageOnly(ChartResults: Array<MultiChartData>) {
        ChartResults.forEach(version=>{
            if(version.series.length!=0&&!(version.series[3].value==0&&version.series[2].value!=0)){
                version.series.forEach(t=>{
                    t.value=0;
                });
            }
        });
        console.log("purified",ChartResults)
        return ChartResults
    }

    displayTriageType(displayType:string, triageViewSupervisor: TriageViewSupervisor){
        console.log("display type",displayType);
        if(displayType=="displayFake"){
            let fakeOnlyVersions = JSON.parse(JSON.stringify(triageViewSupervisor.completeVersions));
            triageViewSupervisor.versionDelayStackedVerticalBarChart.results = [
                ...this.generateVersionDelayStackedVerticalBarChartResultFakeTriageOnly(fakeOnlyVersions)];
        }
        else if(displayType=="displayTrue"){
            let trueOnlyVersions = JSON.parse(JSON.stringify(triageViewSupervisor.completeVersions));
            triageViewSupervisor.versionDelayStackedVerticalBarChart.results = [
                ...this.generateVersionDelayStackedVerticalBarChartResultTrueTriageOnly(trueOnlyVersions)];
        }
        else if(displayType=="displayBoth"){
            triageViewSupervisor.versionDelayStackedVerticalBarChart.results = [...triageViewSupervisor.completeVersions];
        }
    }
}