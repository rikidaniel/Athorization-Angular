import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    try {
      return this.guardCheck(route);
    } catch (e) {
      this.authorizationService.signOut();
      return false;
    }
  }

  private guardCheck(route: ActivatedRouteSnapshot): boolean {
    if (this.authorizationService.isSignedIn()) {
      const userRole = this.authorizationService.getUserRole();
      const roles = route.data['roles'] as Array<string>;

      if (roles && roles.indexOf(userRole) === -1) {
        this.router.navigate(['/not-authorized']).then();
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']).then();
      return false;
    }
  }
}
