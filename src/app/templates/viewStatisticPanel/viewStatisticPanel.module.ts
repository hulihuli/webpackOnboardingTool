import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ViewStatisticPanelComponent } from "./viewStatisticPanel.component";
import { CommonModule } from "../../../../node_modules/@angular/common";

@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
    ],
    exports: [
        ViewStatisticPanelComponent
    ],
	declarations: [
        ViewStatisticPanelComponent
    ]
})

export class ViewStatisticPanelModule {}