import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) : boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(map(
            user => {
                this.router.navigate(['login']);
                return !!user; }
        ));
    };
}