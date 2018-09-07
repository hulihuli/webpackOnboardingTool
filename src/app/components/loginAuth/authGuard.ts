import { Injectable } from "@angular/core";
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AdalService } from "adal-angular4";
import { environment } from "../../../../config/environment/environment";

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
	constructor(private router: Router, private adalService: AdalService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (!environment.enableAAD || this.adalService.userInfo.authenticated) {
			return true;
		} else {
			this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
			return false;
		}
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(childRoute, state);
	}
}
