import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ExperimentDto } from "../../../core/experimentDto"
import { experimentDtos } from '../analysisDashboard.mockdata'
import { AnalysisType } from '../../../core/enums'
import { EntitySpaceAnalysis } from '../../../core/entityAnalysis/entitySpaceAnalysis'

import { EntitySpaceAnalysisService } from '../service/entitySpaceAnalysis.service'
import { AnalysisDashboardService } from '../service/analysisDashboard.service'
import { BaseComponent } from '../../common/base.component';

@Component({
    selector: 'analysis-dashboard',
    templateUrl: './analysisDashboard.component.html',
    //styleUrls: ['./name.component.css']
})

export class AnalysisDashboardComponent extends BaseComponent implements OnInit {
    entityAnalysisDtos: any;
    AnalysisType: typeof AnalysisType = AnalysisType;
    selectedExperiment: ExperimentDto;
    currentAnalysisType: AnalysisType;

    constructor(
        private router: Router,
        private analysisDashboardService: AnalysisDashboardService
    ) {
        super();
    }

    ngOnInit() {
        let currentUrl = this.router.url;
        this.logger.info(currentUrl);
        let pos = currentUrl.lastIndexOf('/');
        let analysisTypeStr = currentUrl.substr(pos + 1);

        this.logger.info(analysisTypeStr);

        this.currentAnalysisType = this.getCurrentAnalysisType(analysisTypeStr);
        this.logger.info(this.currentAnalysisType);

        this.getAnalysisDtos(this.currentAnalysisType);
        //this.logger.info(experimentDtos); 
        // this.analysisDashboardService.getEntitySpaceAnalysisDtos()
        //     .subscribe((response) => {
        //         this.logger.info(response);
        //         this.entityAnalysisDtos = <EntitySpaceAnalysis[]>response;
        //         this.logger.info("entityAnalysisDtos", this.entityAnalysisDtos);
        //         return this.entityAnalysisDtos;
        //     });
    }
    
    getCurrentAnalysisType(analysisTypeStr: string): AnalysisType {
        switch (analysisTypeStr) {
            case "entityspace": {
                return AnalysisType.EntitySpace;
            }
            case "entityview": {
                return AnalysisType.EntitySpace;
            }
            case "entitygraph": {
                return AnalysisType.EntitySpace;
            }
        }
    }

    getAnalysisDtos(analysisType: AnalysisType) {
        switch (analysisType) {
            case AnalysisType.EntitySpace: {
                this.analysisDashboardService.getEntitySpaceAnalysisDtos()
                    .subscribe((response) => {
                        this.logger.info(response);
                        this.entityAnalysisDtos = <EntitySpaceAnalysis[]>response;
                        this.logger.info("entityAnalysisDtos", this.entityAnalysisDtos);
                        return this.entityAnalysisDtos;
                    });
            }
            case AnalysisType.EntityView: {
                return AnalysisType.EntitySpace;
            }
            case AnalysisType.EntityGraph: {
                return AnalysisType.EntitySpace;
            }
        }
    }


    gotoEntityAnalysisDetail() {
        this.router.navigate(['/detail', this.selectedExperiment.id]);
    }

    test() {
        //this.logger.info(experimentDtos);
    }
}