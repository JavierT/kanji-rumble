import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { throwError, BehaviorSubject } from 'rxjs';
import { MyError } from 'app/models/my-error';
import { User } from 'app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
 
@Injectable({
    providedIn: 'root'
})

export class AuthService {
    //user = new Subject<User>();
    user = new BehaviorSubject<User>(null);

    constructor(private firebase: AngularFireAuth, private router: Router) {

    }

    private _handleAuth(email: string, userId: string, token: string) {
        const expirationDate = new Date(new Date().getTime() + 60*60*24*7*1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    login(email:string, password:string) {
        return this.firebase.auth.signInWithEmailAndPassword(email, password)
        .then(value => {
            this._handleAuth(value.user.email, value.user.uid, value.user.refreshToken);
        }) 
        .catch(errorRes => { 
            // Handle Errors here.
            let errorMessage = 'An unknown error ocurred';
            if (!errorRes || !errorRes.code) {
                throw new MyError(errorMessage);
            }
            switch (errorRes.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Mauvaise utilisateur email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mauvaise mot de pass';    
                    break;
                default:
                    errorMessage = errorRes.message;
            }
            throw new MyError(errorMessage);
        });
    }

    autoLogin(route: ActivatedRoute) {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            return;
        }
        const tmpUser: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(userData);
        const loadedUser = new User(
            tmpUser.email, 
            tmpUser.id,  
            tmpUser._token, 
            new Date(tmpUser._tokenExpirationDate));
        // check if the token is valid
        console.log(loadedUser)
        if (loadedUser.token) {
            this.user.next(loadedUser);
            this.router.navigate(['modify'], {relativeTo: route} );
        } else {
            localStorage.removeItem('userData');
        }
    }

    logout() {
        return this.firebase.auth.signOut().then(res => {
            console.log('res logout ', res)
            this.user.next(null);
            localStorage.removeItem('userData');
            this.router.navigate(['/']);
        });
    }

    async sendPasswordResetEmail(passwordResetEmail: string) {
        return await this.firebase.auth.sendPasswordResetEmail(passwordResetEmail);
     }
    

}