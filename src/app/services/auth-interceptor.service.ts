import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next:HttpHandler) {
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                // No need to add an interceptor using firebase
                // console.log(user)
                // if (!user) {
                //     return next.handle(req);
                // }
                
                // const modifiedReq = req.clone(
                //     { setHeaders: { Authorization: `Bearer ${user.token}` } }
                // );
                return next.handle(req);
            })
        );
        
    }

}