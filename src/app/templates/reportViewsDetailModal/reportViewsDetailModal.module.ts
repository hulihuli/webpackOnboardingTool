import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ReportViewsDetailModalComponent } from "./reportViewsDetailModal.component";
import { ViewStatisticPanelModule } from "../viewStatisticPanel/viewStatisticPanel.module";
import { CommonModule } from "../../../../node_modules/@angular/common";

@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
        ViewStatisticPanelModule
    ],
    exports: [
        ReportViewsDetailModalComponent
    ],
	declarations: [
        ReportViewsDetailModalComponent
    ]
})

export class ReportViewsDetailModal {}