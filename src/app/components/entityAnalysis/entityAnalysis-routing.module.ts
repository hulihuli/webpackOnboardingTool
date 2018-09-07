import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "../loginAuth/authGuard";

//analysis
import { AnalysisDashboardComponent } from "./dashboard/analysisDashboard.component";
import { EntityAnalysisComponent } from "./entityAnalysis.component";
// import { EntitySpaceAnalysisComponent } from './entitySpace/entitySpaceAnalysis.component';
import { PayloadExplorerComponent } from "./entitySpace/payloadExplorer.component";
import { PayloadStatisticComponent } from "./entitySpace/payloadStatistic.component";
import { PayloadFilterComponent } from "./entitySpace/payloadFilter.component";
import { EntityViewAnalysisComponent } from "./entityView/entityViewAnalysis.component";
import { EntityGraphAnalysisComponent } from "./entityGraph/entityGraphAnalysis.component";

import { PageNotFoundComponent } from "../trivial/pageNotFound.component";

let allRoutes: Routes = [];

const analysisRoutes: Routes = [
	//{ path: '', redirectTo: '/entityAnalysis', pathMatch: 'full' },
	{
		path: "entityanalysis",
		component: EntityAnalysisComponent,
		children: [
			{
				path: "",
				component: AnalysisDashboardComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "dashboard",
				component: AnalysisDashboardComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entityspace",
				component: AnalysisDashboardComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entityview",
				component: AnalysisDashboardComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entitygraph",
				component: AnalysisDashboardComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entityspace/:id/explorer",
				component: PayloadExplorerComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entityspace/:id/statistic",
				component: PayloadStatisticComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entityspace/:id/filter",
				component: PayloadFilterComponent,
				canActivate: [AuthenticationGuard]
			},
			//{
			// path: 'entityspace',
			// component: EntitySpaceAnalysisComponent,
			// children:[
			// { path: 'entityspace/explorer',  component: PayloadExplorerComponent },
			// { path: 'entityspace/statistic',  component: PayloadStatisticComponent },
			// { path: 'entityspace/filter',  component: PayloadFilterComponent }
			//]
			//},
			{
				path: "entityview",
				component: EntityViewAnalysisComponent,
				canActivate: [AuthenticationGuard]
			},
			{
				path: "entitygraph",
				component: EntityGraphAnalysisComponent,
				canActivate: [AuthenticationGuard]
			}
		]
	}
];

// const wildcardRoutes: Routes = [
//   { path: '**', component: PageNotFoundComponent }
// ];

// allRoutes = allRoutes.concat(analysisRoutes, wildcardRoutes);

@NgModule({
	imports: [
		RouterModule.forChild(
			analysisRoutes
			//his outputs each router event that took place during each navigation lifecycle to the browser console
			//{ enableTracing: true } // <-- debugging purposes only
		)
	],
	exports: [RouterModule]
})
export class EntityAnalysisRoutingModule {}
