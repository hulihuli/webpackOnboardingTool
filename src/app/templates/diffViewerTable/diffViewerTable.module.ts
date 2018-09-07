import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DiffViewerTableComponent } from "./diffViewerTable.component";
import { CommonModule } from "../../../../node_modules/@angular/common";


@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
    ],
    exports: [
        DiffViewerTableComponent
    ],
	declarations: [
        DiffViewerTableComponent
    ]
})

export class DiffViewerTableModule {}