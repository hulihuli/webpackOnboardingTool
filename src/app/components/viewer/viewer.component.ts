import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../common/base.component';

@Component({
    selector: 'viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})

export class ViewerComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() { }
}