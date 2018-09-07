import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { JobPanelComponent } from "./jobPanel.component";
import { CommonModule } from "../../../../node_modules/@angular/common";


@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
    ],
    exports: [
        JobPanelComponent
    ],
	declarations: [
        JobPanelComponent
    ]
})

export class JobPanelModule {}