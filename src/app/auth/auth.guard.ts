import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    let token = sessionStorage.getItem('LEAD_ID');

    // If token is not in sessionStorage,
    // check localStorage
    if (!token) {
      token = localStorage.getItem('LEAD_ID');
    }

    if (token) {
      return true;
    }

    this.router.navigate(['welcome']);
    return false;
  }
}