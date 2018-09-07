import { BaseComponent } from "../../components/common/base.component";
import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { ViewerDiffProperty, ViewerTriple } from "../../core/viewer/entityDiffViewer";
import { ViewerService } from "../../components/viewer/viewer.service";
import { ViewerType } from "../../core/enums";

@Component({
	selector: "diff-viewer-table",
	templateUrl: "./diffViewerTable.component.html",
	styleUrls: ["./diffViewerTable.component.css"]
})
export class DiffViewerTableComponent extends BaseComponent implements OnInit {
	@Input() displayType: ViewerType;
	@Input() isFetchingEntityDiffViewer?: boolean;

	@Output() isFetchingEntityDiffViewerChange = new EventEmitter<boolean>();

	public properties: Array<ViewerDiffProperty>;
	public displayCommon: boolean;

	constructor(private viewerService: ViewerService) {
		super();
	}

	ngOnInit() {
        this.displayCommon = true;
		this.properties = new Array<ViewerDiffProperty>();
	}

    getViewerDiffProperties(viewerType: ViewerType, subjectKey1: string, subjectKey2: string, standardStream: string, triagedStream: string) {
        this.isFetchingEntityDiffViewer = true;
        this.isFetchingEntityDiffViewerChange.emit(this.isFetchingEntityDiffViewer);
        this.viewerService
            .getViewerTriples(viewerType, subjectKey1, subjectKey2, standardStream, triagedStream)
            .subscribe(viewerDiffProperties => {
                this.properties = viewerDiffProperties.viewerDiffProperties;
                this.isFetchingEntityDiffViewer = false;
                this.isFetchingEntityDiffViewerChange.emit(this.isFetchingEntityDiffViewer);
            },
            (error: any) => {
                this.isFetchingEntityDiffViewer = false;
                this.isFetchingEntityDiffViewerChange.emit(this.isFetchingEntityDiffViewer);
        });
    }
}
