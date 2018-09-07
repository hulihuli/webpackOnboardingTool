import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdalService } from "adal-angular4";
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";

import { environment } from "../../config/environment/environment";
import { User } from "./core/common/authUser";

//import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { BaseComponent } from "./components/common/base.component";
import "../assets/css/styles.css";
// import '../assets/css/AdminLTE.css';
// import '../assets/css/_all-skins.css';
//import '../assets/css/side-bar.css';
//import '../assets/sass/test.scss';

@Component({
	selector: "my-app",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
	private sub: any;
	user: User;

	constructor(
		//private slimLoader: SlimLoadingBarService,
		private router: Router,
		private adalService: AdalService
	) {
        super();
        if (environment.enableAAD) {
            this.adalService.init(environment.adalConfig);
        }
	}

	ngOnInit() {
		if (environment.enableAAD) {
            //don't put handleWindowCallback with init, it may cause auth error when call authed web api
            // Handle callback if this is a redirect from Azure
		    this.adalService.handleWindowCallback();
        }

		this.user = new User();
		if (this.adalService.userInfo.authenticated) {
			this.logger.info("authenticated user info", this.adalService.userInfo);
			let profile = this.adalService.userInfo.profile;
			this.user = new User(profile.name, profile.upn, this.adalService.userInfo.authenticated);
		} else {
			throw "";
		}

		//this.startLoading();
		// Listen the navigation events to start or complete the slim bar loading
		this.sub = this.router.events.subscribe(
			event => {
				if (event instanceof NavigationStart && !this.adalService.userInfo.authenticated) {
					// this.slimLoader.start();
					this.router.navigate(["/login"], { queryParams: { returnUrl: "/triage/supervisor" } });
				} else if (
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel ||
					event instanceof NavigationError
				) {
					//this.slimLoader.complete();
				}
			},
			(error: any) => {
				//this.slimLoader.complete();
			}
		);
	}

	// Logout Method
	logout() {
		if (this.user.authenticated) {
			this.adalService.logOut();
			this.adalService.clearCache();
		}
	}

	ngOnDestroy(): any {
		this.sub.unsubscribe();
	}

	// startLoading() {
	//     this.slimLoader.start(() => {
	//         this.logger.info('Loading complete');
	//     });
	// }

	// stopLoading() {
	//     this.slimLoader.stop();
	// }

	// completeLoading() {
	//     this.slimLoader.complete();
	// }
}
