import { Component, OnInit } from '@angular/core';


import {AnalysisType} from '../../../core/enums'


@Component({
    selector: 'payload-statistic',
    templateUrl: './payloadStatistic.component.html',
    //styleUrls: ['./name.component.scss']
})
export class PayloadStatisticComponent implements OnInit {
    analysisType: AnalysisType = AnalysisType.EntitySpace;
    stage: string = "Statistic";
    
    constructor() { }

    ngOnInit() { }
}