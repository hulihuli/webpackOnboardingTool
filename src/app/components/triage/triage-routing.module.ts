import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "../loginAuth/authGuard";


const triageRoutes: Routes = [
    { path: "", redirectTo: "supervisor", pathMatch: "full" },
    {
        path: "supervisor",
        loadChildren: "./triageSupervisor/triageSupervisor.module#TriageSupervisorModule"
    },
    {
        path: "statistic",
        loadChildren: "./triageStatistic/triageStatistic.module#TriageStatisticModule"
    },
    {
        path: "analysis",
        loadChildren: "./triageAnalysis/triageAnalysis.module#TriageAnalysisModule"
    },
    {
        path: "analysis/:customerEnv/:viewKey",
        loadChildren: "./triageAnalysis/triageAnalysis.module#TriageAnalysisModule"
    },
    {
        path: "report",
        loadChildren: "./triageReport/triageReport.module#TriageReportModule"
    },{
        path: "report/:displayType/:reportTimeSpan",
        loadChildren: "./triageReport/triageReport.module#TriageReportModule"
    }
	// {
	// 	path: "triage",
	// 	component: TriageComponent,
	// 	children: [
	// 		{
	// 			path: "statistic",
	// 			component: TriageStatisticComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		},
	// 		{
    //             path: "supervisor",
    //             pathMatch: "full",
	// 			component: TriageSupervisorComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		},
	// 		{
	// 			path: "analysis",
	// 			component: TriageAnalysisComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		},
	// 		{
	// 			//hangle url which redirect from supervisor page
	// 			path: "analysis/:customerEnv/:viewKey",
	// 			component: TriageAnalysisComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		},
	// 		{
	// 			path: "report",
	// 			component: TriageReportComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		},
	// 		{
	// 			path: "report/:displayType/:reportTimeSpan",
	// 			component: TriageReportComponent,
	// 			canActivate: [AuthenticationGuard]
	// 		}
	// 	]
	// }
];

@NgModule({
	imports: [
		RouterModule.forChild(
			triageRoutes
			//his outputs each router event that took place during each navigation lifecycle to the browser console
			//{ enableTracing: true } // <-- debugging purposes only
		)
	],
	exports: [RouterModule]
})
export class TriageRoutingModule {}
