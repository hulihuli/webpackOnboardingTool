import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

import { AnalysisType } from '../../../core/enums'
import { BaseComponent } from '../../common/base.component';

@Component({
    selector: 'analysis-nav',
    templateUrl: './analysisNav.component.html',
    styleUrls: ['./analysisNav.component.css']
})
export class AnalysisNavComponent extends BaseComponent implements OnInit {
    @Input() analysisType: AnalysisType;
    @Input() stage: string;

    constructor() {
        super();
    }

    ngOnInit() {
        this.logger.info(this.analysisType);
    }

    ngAfterViewInit() {
        (<any>$('[data-toggle="tooltip"]')).tooltip();
    }
}