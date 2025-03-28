import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserSettingsService } from '../../services/user-settings.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingScreenGuard implements CanActivate {

  constructor(
    private router: Router,
    private userSettingsService: UserSettingsService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.userSettingsService.$userLocations.pipe(map(userLocations => {
      if (userLocations.length > 0) {
        this.router.navigateByUrl('/main');
        return false;
      } else {
        return true;
      }
    }));
  }

}
