import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//analysis

import { PageNotFoundComponent } from "./components/trivial/pageNotFound.component";

import { LoginComponent } from "./components/loginAuth/login/login.component";
import { LogoutComponent } from "./components/loginAuth/logout/logout.component";
import { AuthenticationGuard } from "./components/loginAuth/authGuard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";


let allRoutes: Routes = [];

const initRoutes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "logout", component: LogoutComponent }
];

const dashboardRoutes: Routes = [
    { path: "", redirectTo: "triage", pathMatch: "full" },
    { 
        path: "triage", 
        loadChildren: './components/triage/triage.module#TriageModule'
    },
	{ 
        path: "dashboard", 
        loadChildren: './components/dashboard/dashboard.module#DashboardModule'
    }
];

const wildcardRoutes: Routes = [{ path: "**", component: PageNotFoundComponent }];

allRoutes = allRoutes.concat(initRoutes, dashboardRoutes, wildcardRoutes);

@NgModule({
	imports: [
		RouterModule.forRoot(
			allRoutes
			//his outputs each router event that took place during each navigation lifecycle to the browser console
			//{ enableTracing: true } // <-- debugging purposes only
		)
    ],
	exports: [RouterModule]
})
export class AppRoutingModule {}
