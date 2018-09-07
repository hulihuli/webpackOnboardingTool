import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "../loginAuth/authGuard";

//metric
import { MetricComponent } from "./metric.component";
import { OnboardingTfsMetricComponent } from "./onboardingTfsMetric/onboardingTfsMetric.component";

const reportRoutes: Routes = [
	{ path: "metric", redirectTo: "/metric/onboardingTfs", pathMatch: "full" },
	{
		path: "metric",
		component: MetricComponent,
		children: [
			{
				path: "onboardingTfs",
				component: OnboardingTfsMetricComponent,
				canActivate: [AuthenticationGuard]
			}
			//   {
			//     path: 'contribution',
			//     component: ContributionComponent
			//   },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(reportRoutes)],
	exports: [RouterModule]
})
export class MetricRoutingModule {}
