import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';


import {AnalysisType} from '../../../core/enums'

import { EntitySpaceAnalysisService } from '../service/entitySpaceAnalysis.service'
import { EntitySpaceAnalysis } from '../../../core/entityAnalysis/entitySpaceAnalysis'

@Component({
    selector: 'payload-explorer',
    templateUrl: './payloadExplorer.component.html',
    //styleUrls: ['./name.component.scss']
})
export class PayloadExplorerComponent implements OnInit {
    analysisType: AnalysisType = AnalysisType.EntitySpace;
    stage: string = "Explorer";
    entitySpaceAnalysis: EntitySpaceAnalysis

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private entitySpaceAnalysisService: EntitySpaceAnalysisService
    ) { }

    ngOnInit(): void {
        this.route.paramMap
        .switchMap((params: ParamMap) => this.entitySpaceAnalysisService.getEntitySpaceAnalysis(+params.get('id')))
        .subscribe(entitySpaceAnalysis => this.entitySpaceAnalysis = entitySpaceAnalysis);
     }
}