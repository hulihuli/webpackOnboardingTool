import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewerComponent } from "./viewer.component";
import { EntityDiffViewerComponent } from "./entityDiffViewer/entityDiffViewer.component";
import { PayloadDiffViewerComponent } from "./payloadDiffViewer/payloadDiffViewer.component";
import { AuthenticationGuard } from "../loginAuth/authGuard";

const viewerRoutes: Routes = [
	{
		path: "viewer",
		component: ViewerComponent,
		children: [
            {
				path: "entityDiff",
				component: EntityDiffViewerComponent,
				canActivate: [AuthenticationGuard]
			},
            {
				path: "payloadDiff",
                component: PayloadDiffViewerComponent,
                canActivate: [AuthenticationGuard]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(viewerRoutes)],
	exports: [RouterModule]
})
export class ViewerRoutingModule {}
