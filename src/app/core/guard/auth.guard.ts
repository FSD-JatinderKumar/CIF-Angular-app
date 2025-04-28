import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  checkTokenOnly: boolean = false;
    constructor(protected router: Router ) {}

    canActivate(checkTokenOnly: any) {
        if (localStorage.getItem('access_token')) {
            // logged in so return true
            return true;
        }
        if (checkTokenOnly) {
            let url = this.router.url.toLocaleLowerCase();
            if (url != '/' && !url.startsWith('/signin') && !url.startsWith('/signup')) {
                
                    this.router.navigate(['/signin']);
                    return false;
                
            }
        }
        return true;
    }
}
