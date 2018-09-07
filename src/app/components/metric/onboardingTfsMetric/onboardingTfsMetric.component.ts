import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../common/base.component";
import { MetricService } from "../metric.service";
import { OnboardingTfsFeature } from "../../../core/metric/metric";
import * as XLSX from 'xlsx';
import { ExcelService } from "../../common/excel.service";

@Component({
	selector: "onboarding-tfs-metric",
    templateUrl: "./onboardingTfsMetric.component.html",
	styleUrls: ["./onboardingTfsMetric.component.css"]    
})
export class OnboardingTfsMetricComponent extends BaseComponent implements OnInit {
    isGeneratingMetric: boolean;
    onboardingTfsFeatures: Array<OnboardingTfsFeature>;
    tfsQueryId: string;
    isExportingAsExcel: boolean;
    tfsUrlPrefix: string;

	constructor(public metricService: MetricService, public excelService: ExcelService) {
        super();
    }

	ngOnInit() {
        this.isGeneratingMetric = false;
        this.isExportingAsExcel = false;
        this.tfsQueryId = "db1f0e76-7875-4161-a5d3-a093ea249492";
        this.tfsUrlPrefix = "https://msasg.visualstudio.com/Satori%20Data%20Onboarding/_workitems/edit/";
        this.generateOnboardingMetric();
    }

    generateOnboardingMetric() {
        this.isGeneratingMetric = true;
        this.metricService.generateTfsMetric(this.tfsQueryId).subscribe((onboardingTfsFeatures: Array<OnboardingTfsFeature>) => {
            this.isGeneratingMetric = false;            
            this.onboardingTfsFeatures = onboardingTfsFeatures;
        });
    }

    convertMetricToArray(): string[][] {
        let metricExcelFromatData: string[][] = [];
        let featureCount: number = this.onboardingTfsFeatures.length;
        let idx: number = 0;
        metricExcelFromatData[idx++] = ["Type", "Title", "Ticketing", "Queued", "E2EEngineering", "E2EHead", "Engineering", "E2ETail"];        
        for(let i = 0; i < featureCount; i++) {
            let userStoryCount: number = this.onboardingTfsFeatures[i].userStories.length;
            metricExcelFromatData[idx++] = ["Feature", this.onboardingTfsFeatures[i].title, "", "", "", "", "", this.onboardingTfsFeatures[i].e2ETailHours];
            for(let j = 0; j < userStoryCount; j++) {
                let taskCount: number = this.onboardingTfsFeatures[i].userStories[j].userTasks.length;
                metricExcelFromatData[idx++] = ["OnboardRequest", 
                    this.onboardingTfsFeatures[i].userStories[j].title, 
                    this.onboardingTfsFeatures[i].userStories[j].ticketingHours, 
                    this.onboardingTfsFeatures[i].userStories[j].queuedHours, 
                    this.onboardingTfsFeatures[i].userStories[j].e2EEngineeringHours, 
                    this.onboardingTfsFeatures[i].userStories[j].e2EHeadHours, 
                    this.onboardingTfsFeatures[i].userStories[j].engineeringHours, 
                    this.onboardingTfsFeatures[i].userStories[j].e2ETailHours];

                for (let k = 0; k < taskCount; k++) {
                    metricExcelFromatData[idx++] = ["Task", 
                        this.onboardingTfsFeatures[i].userStories[j].userTasks[k].title, 
                        "", "", "", "", "", 
                        this.onboardingTfsFeatures[i].userStories[j].userTasks[k].e2ETailHours];
                }
            }
        }

        this.logger.info("metricExcelFromatData", metricExcelFromatData);
        return metricExcelFromatData;
    }

    exportAsExcel() {
        let exportData: string[][] = this.convertMetricToArray();
        this.excelService.exportAsExcel(this.tfsQueryId, exportData, this.isGeneratingMetric);
    }
}
