import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs/Rx";

import { JobType, JobState, JobPanelState } from "../../core/job/job";
import { AetherJob } from "../../core/job/AetherJob";
import { BaseComponent } from "../../components/common/base.component";
import { ChurnCount, TriageChurn, TriageAnalysisResultType } from "../../core/triage/tirageAnlaysisResult";
import { EntityViewVersion } from "../../core/common/entityView";
import { DiffViewerTableComponent } from "../diffViewerTable/diffViewerTable.component";
import { ViewerType } from "../../core/enums";
//import * as Collections from 'typescript-collections';

@Component({
	selector: "triage-analysis-result",
	templateUrl: "./triageAnalysisResult.component.html",
	styles: [require("./triageAnalysisResult.component.scss").toString()]
})
export class TriageAnalysisResultComponent extends BaseComponent implements OnInit {
	@Input() churnCount: ChurnCount;
	@Input() triageChurn: TriageChurn;
	@Input() currentSide1: EntityViewVersion;
    @Input() currentSide2: EntityViewVersion;
    @Input() property?: string;

    @ViewChild(DiffViewerTableComponent) diffViewerTableComponentChild:DiffViewerTableComponent;//this child is the DiffViewerTable component

    displayType: ViewerType;
    isFetchingEntityDiffViewer: boolean;
    triageAnalysisResultType: TriageAnalysisResultType;

	constructor() {
		super();
	}

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        // only run when property "churnCount" changed
        if (changes['churnCount']) {
            this.setFirstAvailableAnalysisResult();
        }
    }

    setFirstAvailableAnalysisResult() {
        this.triageAnalysisResultType = new TriageAnalysisResultType();
        if (!this.churnCount || this.churnCount.totalCount == 0) {
            return;
        }

        if (this.churnCount.deletedLayerCount.entityCount != 0) {
            this.triageAnalysisResultType.deletedEntity = true;
            return;
        }

        if (this.churnCount.deletedLayerCount.propertyCount != 0) {
            this.triageAnalysisResultType.deletedProperty = true;
            return;
        }

        if (this.churnCount.deletedLayerCount.valueCount != 0) {
            this.triageAnalysisResultType.deletedValue = true;
            return;
        }

        if (this.churnCount.addedLayerCount.entityCount != 0) {
            this.triageAnalysisResultType.addedEntity = true;
            return;
        }

        if (this.churnCount.addedLayerCount.propertyCount != 0) {
            this.triageAnalysisResultType.addedProperty = true;
            return;
        }

        if (this.churnCount.addedLayerCount.valueCount != 0) {
            this.triageAnalysisResultType.addedValue = true;
            return;
        }
        
        if (this.churnCount.churnedLayerCount.valueCount != 0) {
            this.triageAnalysisResultType.churn = true;
            return;
        }
    }
    
    isRawUrl(url: string): boolean {
        //for some cases, its url is null
        if (url) {
            let upperCasedUrl = url.toUpperCase();
		    return upperCasedUrl.startsWith("HTTP");
        }
		return false;
	}    

    generateEntityViewerSBS(subject: string, viewerType: ViewerType) {
        this.diffViewerTableComponentChild.getViewerDiffProperties(viewerType, subject, '', this.currentSide1.relativeStreamPath, this.currentSide2.relativeStreamPath);
        this.displayType = viewerType;
    }
}
