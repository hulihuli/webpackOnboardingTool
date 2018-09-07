import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/base.component';

@Component({
    selector: 'view-analysis',
    templateUrl: './entityViewAnalysis.component.html',
    //styleUrls: ['./name.component.css']
})
export class EntityViewAnalysisComponent extends BaseComponent implements OnInit {
    constructor() { 
        super();
        this.logger.info("entity view analysis");        
    }

    ngOnInit() { }
}