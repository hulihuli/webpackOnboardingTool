import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'work-item-table',
    templateUrl: './WorkItemTable.component.html',
    //styleUrls: ['./WorkItemTable.component.css']
})
export class WorkItemTableComponent implements OnInit {
    columns: Array<string>;
    attributes: Array<string>;
    
    constructor() {
        this.columns = ["EntitySpaceName", "CustomerId", "CustomerEnv", "CreatedBy", "UpdatedBy", "Action"];

        this.attributes = [];
     }

    ngOnInit() { }
}