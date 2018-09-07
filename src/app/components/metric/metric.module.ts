import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms"; //ngModel
import { HttpModule } from "@angular/http";
//routes
import { MetricRoutingModule } from "./metric-routing.module";
import { MetricComponent } from "./metric.component";
import { OnboardingTfsMetricComponent } from "./onboardingTfsMetric/onboardingTfsMetric.component";
import { MetricService } from "./metric.service";
import { ExcelService } from "../common/excel.service";
import { CommonModule } from "../../../../node_modules/@angular/common";


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpModule,
		MetricRoutingModule
		//SlimLoadingBarModule.forRoot()
	],
	declarations: [
        MetricComponent,
        OnboardingTfsMetricComponent
    ],
	providers: [
        MetricService,
        ExcelService
    ]
})
export class MetricModule {}
