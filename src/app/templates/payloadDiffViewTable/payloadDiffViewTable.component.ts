import { BaseComponent } from "../../components/common/base.component";
import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { ViewerPayloadDiffProperty, ViewerPayloadDiff } from "../../core/viewer/PayloadDiffViewer";
import { ViewerService } from "../../components/viewer/viewer.service";
import { ViewerType } from "../../core/enums";

@Component({
    selector: "payload-diff-viewer-table",
    templateUrl: "./payloadDiffViewTable.component.html",
    styles: [require('./payloadDiffViewTable.component.scss').toString()]
})
export class PayloadDiffViewerTableComponent extends BaseComponent implements OnInit {
    @Input() displayType: ViewerType;
    @Input() isFetchingPayloadDiffViewer?: boolean;

    @Output() isFetchingPayloadDiffViewerChange = new EventEmitter<boolean>();

    public properties: Array<ViewerPayloadDiffProperty>;
    public displayCommon: boolean;
    public expandAll: boolean;
    public payloadDiffResult: object;

    constructor(private viewerService: ViewerService) {
        super();
    }

    ngOnInit() {
        this.displayCommon = true;
        this.expandAll = false;
        this.properties = new Array<ViewerPayloadDiffProperty>();
    }

    getViewerPayloadDiffProperties(viewerType: ViewerType, modelIdStr: string, externalId1: string, externalId2: string, standardEpRelativeStreamPath: string, triageEpRelativeStreamPath?: string) {
        this.isFetchingPayloadDiffViewer = true;
        this.isFetchingPayloadDiffViewerChange.emit(this.isFetchingPayloadDiffViewer);
        this.viewerService
            .getViewerPayloadDiff(viewerType, modelIdStr, externalId1, externalId2, standardEpRelativeStreamPath, triageEpRelativeStreamPath)
            .subscribe(payloadDiffResult => {
                this.payloadDiffResult = payloadDiffResult;
                this.properties = payloadDiffResult.payloadDiffProperties;
                this.isFetchingPayloadDiffViewer = false;
                this.isFetchingPayloadDiffViewerChange.emit(this.isFetchingPayloadDiffViewer);
            },
            (error: any) => {
                this.isFetchingPayloadDiffViewer = false;
                this.isFetchingPayloadDiffViewerChange.emit(this.isFetchingPayloadDiffViewer);
            });
    }
}
