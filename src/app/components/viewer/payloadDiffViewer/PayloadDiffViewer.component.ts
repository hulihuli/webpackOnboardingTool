import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../../common/base.component";
import { ViewerType } from "../../../core/enums";
import { PayloadDiffViewerTableComponent } from "../../../templates/payloadDiffViewTable/payloadDiffViewTable.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "payload-diff-viewer",
    templateUrl: "./payloadDiffViewer.component.html",
    styleUrls: ["./payloadDiffViewer.component.css"],
})
export class PayloadDiffViewerComponent extends BaseComponent implements OnInit {
    public viewerType: ViewerType;
    public modelIdStr: string;
    public externalId1: string;
    public externalId2: string;
    public standardEpRelativeStreamPath: string;
    public triageEpRelativeStreamPath: string;
    public isFetchingPayloadDiffViewer: boolean;
    public displayCommon: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super();
    }

    @ViewChild(PayloadDiffViewerTableComponent) PayloadDiffViewerTableComponentChild: PayloadDiffViewerTableComponent;//this child is the DiffViewerTable component

    ngOnInit() {
        this.viewerType = ViewerType.ViewerDiff;
        this.standardEpRelativeStreamPath = this.route.snapshot.queryParamMap.get("standardEpRelativeStreamPath");
        this.triageEpRelativeStreamPath = this.route.snapshot.queryParamMap.get("triageEpRelativeStreamPath");
        this.externalId1 = this.route.snapshot.queryParamMap.get("externalId1");
        this.externalId2 = this.route.snapshot.queryParamMap.get("externalId2");
        this.modelIdStr = this.route.snapshot.queryParamMap.get("modelIdStr");
        let viewerType = this.route.snapshot.queryParamMap.get("viewerType");

        switch (viewerType) {
            case "0": {
                this.viewerType = ViewerType.Viewer;
                if (this.standardEpRelativeStreamPath && this.externalId1) {
                    this.getViewerDiffProperties();
                }
                break;
            };
            case "1": {
                this.viewerType = ViewerType.ViewerDiff;
                if (this.standardEpRelativeStreamPath && this.triageEpRelativeStreamPath && this.externalId1) {
                    this.getViewerDiffProperties();
                }
                break;
            };
            case "2": {
                this.viewerType = ViewerType.ViewerDiffOfTwo;
                if (this.standardEpRelativeStreamPath && this.triageEpRelativeStreamPath && this.externalId1 && this.externalId2) {
                    this.getViewerDiffProperties();
                }
                break;
            };
        };
    }

    getViewerDiffProperties() {
        //change url params
        this.router.navigate(["/viewer/payloadDiff"], {
            queryParams: {
                "viewerType": this.viewerType,
                "modelIdStr": this.modelIdStr ? this.modelIdStr : "",
                "externalId1": this.externalId1,
                "externalId2": this.externalId2,
                "standardEpRelativeStreamPath": this.standardEpRelativeStreamPath,
                "triageEpRelativeStreamPath": this.triageEpRelativeStreamPath
            }
        });
        if (this.viewerType != ViewerType.ViewerDiffOfTwo) {
            this.externalId2 = "";
        }
        if (this.viewerType == ViewerType.Viewer) {
            this.triageEpRelativeStreamPath = "";
        }
        this.PayloadDiffViewerTableComponentChild.getViewerPayloadDiffProperties(this.viewerType, this.modelIdStr, this.externalId1, this.externalId2, this.standardEpRelativeStreamPath, this.triageEpRelativeStreamPath);
    }
}