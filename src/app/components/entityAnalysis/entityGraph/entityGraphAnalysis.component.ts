import { Component, OnInit } from '@angular/core';
import { EntitySpaceAnalysis } from '../../../core/entityAnalysis/entitySpaceAnalysis'
import { BaseComponent } from '../../common/base.component';

@Component({
    selector: 'graph-analysis',
    templateUrl: './entityGraphAnalysis.component.html',
    //styleUrls: ['./name.component.css']
})
export class EntityGraphAnalysisComponent extends BaseComponent implements OnInit {
    constructor() {
        super();
        this.logger.info("graph analysis");
    }

    ngOnInit() { }
}