import { Injectable, NgZone, ɵPlayer } from '@angular/core';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Player } from 'app/models/player.model';
import { throwError, BehaviorSubject, Subject } from 'rxjs';
import { MyError } from 'app/models/my-error';
import { DataService } from './data.service';
import { Irecord } from 'app/models/records.model.';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  playerData: Player; // Save logged in user data


  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router, 
    private dataService: DataService, 
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.playerData = this.parseFbUsertoPlayer(user);
        localStorage.setItem('user', JSON.stringify(this.playerData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  saveInStorage(user) {
    this.playerData = this.parseFbUsertoPlayer(user);
    localStorage.setItem('user', JSON.stringify(this.playerData));
  }

  parseFbUsertoPlayer(user: User): Player {
    const player: Player = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return player;
  }


  getUserData() {
    const ready = new Subject<Player>();
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        this.playerData = this.parseFbUsertoPlayer(user);
        console.log(user)
        ready.next(this.playerData);
      } else {
        ready.thrownError( new MyError("Se ha producido un error al cargar los datos del jugador"))
      }
    });
    return ready;
  }

  // Sign in with email/password
  signIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.saveInStorage(result.user);
        this.ngZone.run(() => {
          this.router.navigate(['/account']);
        })
      }).catch((error) => {
        console.log(error)
        const message = MyError.translateAuthError(error.code);
        throw new MyError(message);
      }
    );
  }

  // Sign up with email/password
  registerWithEmail(email, password, username) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user, username);
        this.sendVerificationMail();
        this.ngZone.run(() => {
          this.router.navigate(['/verify-email']);
        })
        return result.user.uid;
      }).catch((error) => {
        console.log(error)
        throw new MyError("Registro fallido");
      }
    );
  }

//   // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      //this.router.navigate(['verify-email-address']);
      return true;
    }).catch((error) => {
      console.log(error)
      throw new MyError("Envio de correo fallido");
    });
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get userUid(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? user.uid : null;
  }

//   // Sign in with Google
  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider()).then((result) => {
      const subs = this.setUserData(result.user).pipe(take(1)).subscribe(() => {
        console.log("user data saved")
        this.ngZone.run(() => {
          console.log("doing redirection to account")
          this.router.navigate(['account']);
        });
        
      });
    }).catch((error) => {
      console.log(error)
      throw new MyError("Autentificacion con Google fallida");
    });
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user, displayName=null): BehaviorSubject<Player> {
    const ready = new BehaviorSubject<Player>(null);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.get().subscribe((doc) => {
      if (doc.exists) {
      } else {
          const playerData: Player = {
            uid: user.uid,
            email: user.email,
            displayName: displayName ? displayName : user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          }
          userRef.set(playerData, {
            merge: true
          })
          const record = this.dataService.createEmptyRecord(user.uid);
          this.dataService.createRecord(record);
      }
      this.saveInStorage(user);
      ready.next(user);
    });
    return ready;
  }

  // Sign out 
  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      //this.router.navigate(['home']);
      return true;
    }).catch((error) => {
      console.log(error)
      return false;
    });
  }

  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
  }

}