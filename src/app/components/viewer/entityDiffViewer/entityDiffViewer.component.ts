import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../../common/base.component";
import { DiffViewerTableComponent } from "../../../templates/diffViewerTable/diffViewerTable.component";
import { ViewerType } from "../../../core/enums";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "entity-diff-viewer",
    templateUrl: "./entityDiffViewer.component.html",
    styleUrls: ["./entityDiffViewer.component.css"],
})
export class EntityDiffViewerComponent extends BaseComponent implements OnInit {
    public subjectKey1: string;
    public subjectKey2: string;
    public standardStream: string;
    public triagedStream: string;
    public viewerType: ViewerType;
    public isFetchingEntityDiffViewer: boolean;
    public displayCommon: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super();
    }

    @ViewChild(DiffViewerTableComponent) diffViewerTableComponentChild: DiffViewerTableComponent;//this child is the DiffViewerTable component

    ngOnInit() {
        this.viewerType = ViewerType.ViewerDiff;
        this.standardStream = this.route.snapshot.queryParamMap.get("standardStreamPath");
        this.triagedStream = this.route.snapshot.queryParamMap.get("triageStreamPath");
        this.subjectKey1 = this.route.snapshot.queryParamMap.get("subject1");
        this.subjectKey2 = this.route.snapshot.queryParamMap.get("subject2");
        let viewerType = this.route.snapshot.queryParamMap.get("viewerType");

        switch (viewerType) {
            case "0": {
                this.viewerType = ViewerType.Viewer;
                if (this.standardStream && this.subjectKey1) {
                    this.getViewerDiffProperties();
                }
                break;
            };
            case "1": {
                this.viewerType = ViewerType.ViewerDiff;
                if (this.standardStream && this.triagedStream && this.subjectKey1) {
                    this.getViewerDiffProperties();
                }
                break;
            };
            case "2": {
                this.viewerType = ViewerType.ViewerDiffOfTwo;
                if (this.standardStream && this.triagedStream && this.subjectKey1 && this.subjectKey2) {
                    this.getViewerDiffProperties();
                }
                break;
            };
        };
    }

    getViewerDiffProperties() {
        //change url params
        this.router.navigate(["/viewer/entityDiff"], {
            queryParams: {
                "viewerType": this.viewerType,
                "subject1": this.subjectKey1,
                "subject2": this.subjectKey2,
                "standardStreamPath": this.standardStream,
                "triageStreamPath": this.triagedStream
            }
        });

        if (this.viewerType != ViewerType.ViewerDiffOfTwo) {
            this.subjectKey2 = "";
        }
        if (this.viewerType == ViewerType.Viewer) {
            this.triagedStream = "";
        }
        this.diffViewerTableComponentChild.getViewerDiffProperties(this.viewerType, this.subjectKey1, this.subjectKey2, this.standardStream, this.triagedStream);
    }
}