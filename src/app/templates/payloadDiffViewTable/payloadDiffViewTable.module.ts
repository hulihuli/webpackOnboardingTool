import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PayloadDiffViewerTableComponent } from "./payloadDiffViewTable.component";
import { NgxJsonViewerModule } from "../ngxJsonViewer/ngxJsonViewer.module";
import { UiSwitchModule } from "ngx-ui-switch";
import { CommonModule } from "../../../../node_modules/@angular/common";


@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
        NgxJsonViewerModule,
        UiSwitchModule
    ],
    exports: [
        PayloadDiffViewerTableComponent
    ],
	declarations: [
        PayloadDiffViewerTableComponent
    ]
})

export class PayLoadDiffViewerTableModule {}