import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../common/base.component";

@Component({
	selector: "logout",
	templateUrl: "./logout.component.html"
})
export class LogoutComponent extends BaseComponent implements OnInit {
	constructor() {
		super();
	}

	ngOnInit() {}
}
