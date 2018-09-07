import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "../loginAuth/authGuard";

//analysis
import { ReportComponent } from "./report.component";
import { ContributionComponent } from "./contribution/contribution.component";

const reportRoutes: Routes = [
	//{ path: '', redirectTo: '/entityAnalysis', pathMatch: 'full' },
	{
		path: "report",
		component: ReportComponent,
		children: [
			{
				path: "",
				component: ContributionComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "contribution",
				component: ContributionComponent,
				canActivate: [AuthenticationGuard]
			}
			// {
			//   path: 'entityspace',
			//   component: AnalysisDashboardComponent
			// },
			// {
			//   path: 'entityview',
			//   component: AnalysisDashboardComponent
			// },
			// {
			//   path: 'entitygraph',
			//   component: AnalysisDashboardComponent
			//},
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(
			reportRoutes
			//his outputs each router event that took place during each navigation lifecycle to the browser console
			//{ enableTracing: true } // <-- debugging purposes only
		)
	],
	exports: [RouterModule]
})
export class ReportRoutingModule {}
