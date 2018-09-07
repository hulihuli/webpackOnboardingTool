import { Component, OnChanges, Input, OnInit } from '@angular/core';
// var data = require('./entityJson.json');

export interface Segment {
    key: string;
    value: any;
    type: undefined | string;
    description: string;
    level: number;
    expanded: boolean;
}

@Component({
    selector: 'ngx-json-viewer',
    templateUrl: './ngxJsonViewer.component.html',
    styles: [require('./ngxJsonViewer.component.scss').toString()]
})
export class NgxJsonViewerComponent implements OnInit, OnChanges {

    // @Input() json: any = data;
    @Input() json: any;
    @Input() expanded: boolean = false;
    @Input() expandLevel: number = 3;
    @Input() curLevel: number = 1;
    /**
     * @deprecated It will be always true and deleted in version 3.0.0
     */
    @Input() cleanOnChange = true;

    segments: Segment[] = [];

    ngOnInit() {
        if (this.json && typeof this.json === 'string') {
            this.json = JSON.parse(this.json);
        }
        this.ngOnChanges();
    }

    ngOnChanges() {
        if (this.cleanOnChange) {
            this.segments = [];
        }
          
        if (typeof this.json === 'object') {
            Object.keys(this.json).forEach(key => {               
                this.segments.push(this.parseKeyValue(key, this.json[key], this.curLevel));
            });
        }
    }

    isExpandable(segment: Segment) {
        return (segment.type === 'object' || segment.type === 'array');
    }

    isExpandLevel() {
        return this.curLevel <= this.expandLevel;
    }

    toggle(segment: Segment) {
        if (this.isExpandable(segment)) {
            segment.expanded = !segment.expanded;
        }
    }

    private parseKeyValue(key: any, value: any, level: number): Segment {      
        const segment: Segment = {
            key: key,
            value: value,
            type: undefined,
            description: '' + value,
            level: level,
            expanded: this.isExpandLevel() && ((typeof value === 'object') || Array.isArray(value))
        };
        switch (typeof segment.value) {
            case 'number': {
                segment.type = 'number';
                break;
            }
            case 'boolean': {
                segment.type = 'boolean';
                break;
            }
            case 'function': {
                segment.type = 'function';
                break;
            }
            case 'string': {
                segment.type = 'string';
                segment.description = '"' + segment.value + '"';
                break;
            }
            case 'undefined': {
                segment.type = 'undefined';
                segment.description = 'undefined';
                break;
            }
            case 'object': {
                // yea, null is object
                if (segment.value === null) {
                    segment.type = 'null';
                    segment.description = 'null';
                } else if (Array.isArray(segment.value)) {
                    segment.type = 'array';
                    segment.description = 'Array[' + segment.value.length + '] ' + JSON.stringify(segment.value);
                } else if (segment.value instanceof Date) {
                    segment.type = 'date';
                } else {
                    segment.type = 'object';
                    segment.description = 'Object ' + JSON.stringify(segment.value);
                }
                break;
            }
        }

        return segment;
    }
}
