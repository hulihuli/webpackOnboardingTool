import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdalService } from "adal-angular4";
import { BaseComponent } from "../../common/base.component";

@Component({
	selector: "login",
	templateUrl: "./login.component.html"
})
export class LoginComponent extends BaseComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router, private adalService: AdalService) {
		super();
	}

	ngOnInit() {
		this.authenticateUser();
	}

	authenticateUser() {
		let returnUrl: string = this.route.snapshot.queryParams["returnUrl"] || "/";

		if (this.adalService.userInfo.authenticated) {
			this.router.navigate([returnUrl]);
		} else {
			this.adalService.login();
		}
	}
}
