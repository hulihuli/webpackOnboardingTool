import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms"; //ngModel
import { Ng2Webstorage } from "ngx-webstorage";

//routes
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { AdalService, AdalGuard } from "adal-angular4";
import { AuthenticationGuard } from "./components/loginAuth/authGuard";
import { LoginComponent } from "./components/loginAuth/login/login.component";
import { LogoutComponent } from "./components/loginAuth/logout/logout.component";

//child module
import { EntityAnalysisModule } from "./components/entityAnalysis/entityAnalysis.module";
import { ReportModule } from "./components/report/report.module";

//plugins
//import {SlimLoadingBarModule} from 'ng2-slim-loading-bar'

import { PageNotFoundComponent } from "./components/trivial/pageNotFound.component";
import { ViewerModule } from "./components/viewer/viewer.module";
import { MetricModule } from "./components/metric/metric.module";
import { CommonModule } from "../../node_modules/@angular/common";
import { BrowserModule } from "../../node_modules/@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
	imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
		Ng2Webstorage,
		EntityAnalysisModule,
		ReportModule,
		ViewerModule,
		MetricModule,
		AppRoutingModule
		//SlimLoadingBarModule.forRoot()
	],
	declarations: [LoginComponent, LogoutComponent, AppComponent, PageNotFoundComponent],
	providers: [AdalService, AdalGuard, AuthenticationGuard],
	bootstrap: [AppComponent]
})
export class AppModule {}
