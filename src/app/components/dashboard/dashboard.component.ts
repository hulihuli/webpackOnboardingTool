import { Component, OnInit } from '@angular/core';

import { ExperimentDto } from "../../core/experimentDto"
//import { experimentDtos } from '../../app.mockdata'
import { AnalysisType } from '../../core/enums'
import { BaseComponent } from '../common/base.component';

@Component({
    selector: 'selector',
    templateUrl: './dashboard.component.html',
    styleUrls: ["./dashboard.component.css"]
    //styleUrls: ['./name.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {
    experimentDtos: Array<ExperimentDto>;
    AnalysisType: typeof AnalysisType = AnalysisType;
    constructor() {
        super();
    }

    ngOnInit() {
        //this.logger.info(experimentDtos);
        //this.experimentDtos = experimentDtos;        
    }

    test() {
        //this.logger.info(experimentDtos);
    }
}