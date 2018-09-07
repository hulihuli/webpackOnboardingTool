import { Component, OnInit } from '@angular/core';


import {AnalysisType} from '../../../core/enums'


@Component({
    selector: 'payload-filter',
    templateUrl: './payloadFilter.component.html',
    //styleUrls: ['./name.component.scss']
})
export class PayloadFilterComponent implements OnInit {
    analysisType: AnalysisType = AnalysisType.EntitySpace;
    stage: string = "Filter";
    
    constructor() {
    }

    ngOnInit() { }
}