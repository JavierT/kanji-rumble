import { Injectable, NgZone, ɵPlayer } from '@angular/core';
import { auth, User } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Player } from 'app/models/player.model';
import { throwError, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { MyError } from 'app/models/my-error';
import { DataService } from './data.service';
import { Irecord } from 'app/models/records.model.';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  playerData: Player; // Save logged in user data
  guestMode = false;
  
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router, 
    private dataService: DataService, 
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user && user.uid !== undefined) {
        this.saveInStorage(user);
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  saveInStorage(user) {
    const savedSubject = new Subject<Player>();
    this.dataService.getPlayer(user.uid).subscribe((player) => {
      this.playerData = player.data() as Player;
      localStorage.setItem('user', JSON.stringify(this.playerData));
      savedSubject.next(this.playerData);
    });
    return savedSubject;
  }

  getUserData(): ReplaySubject<Player> {
    const ready = new ReplaySubject<Player>();
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        this.dataService.getPlayer(user.uid).subscribe((player) => {
          this.playerData = player.data() as Player;
          // If the email has been verified, we update the database
          if (this.playerData.emailVerified !== user.emailVerified) {
            this.dataService.updatePlayer(player.id, {emailVerified: user.emailVerified})
              .pipe(take(1)).subscribe((res) => {
                this.playerData.emailVerified = user.emailVerified;
                ready.next(this.playerData);
              });
          }
          ready.next(this.playerData);
        });
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
        console.log("Successful login")
        this.saveInStorage(result.user).pipe(take(1)).subscribe(
          (playerData) => {
            console.log("User stored successfully")
            this.dataService.getRecordByUserId(playerData.uid);
            this.ngZone.run(() => {
              this.router.navigate(['/account']);
            })
          }
        );
        
      }).catch((error) => {
        console.log(error)
        const message = MyError.translateAuthError(error.code);
        throw new MyError(message);
      }
    );
  }

  loginWithGoogleAuth() {
    return this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider)
      .then((result) => {
        console.log("redirect ok ")
        this.afAuth.auth.getRedirectResult()
        .then(function(result) {
          console.log("getRedirectResult  ", result)
          console.log("Successful login with Google")
          this.saveInStorage(result.user).pipe(take(1)).subscribe(
            (playerData) => {
              console.log("User stored successfully")
              this.dataService.getRecordByUserId(playerData.uid);
              this.ngZone.run(() => {
                this.router.navigate(['/account']);
              })
            });
        }).catch((error) => {
          console.log(error)
          const message = MyError.translateAuthError(error.code);
          throw new MyError(message);
        }
        ); // end redirect results
        
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
        this.setUserData(result.user, username).pipe(take(1)).subscribe((player) => {
          this.sendVerificationMail();
          this.ngZone.run(() => {
            this.router.navigate(['/verify-email']);
          })
          return player.uid;
        });
      }).catch((error) => {
        console.log(error)
        throw new MyError("Registro fallido");
      }
    );
  }

  
  // Auth logic to run auth providers
  registerWithGoogleAuth() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then((result) => {
      this.setUserData(result.user).pipe(take(1)).subscribe((player) => {
        console.log("setUserData next with ", player)
        this.ngZone.run(() => {
          console.log("good to go, router to account")
          this.router.navigate(['/account']);
        });
        return player.uid;
      });
    }).catch((error) => {
      console.log(error)
      throw new MyError("Registro fallido");
    })
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
    return (user !== null) ? true : false;
    //return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get userUid(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? user.uid : null;
  }


  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user, displayName=null): Subject<Player> {
    const ready = new Subject<Player>();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.get().pipe(take(1)).subscribe((doc) => {
      if (doc.exists) {
        // User already in the database.
        console.log('User already registered')
      } else {
          const playerData: Player = {
            uid: user.uid,
            email: user.email,
            displayName: displayName ? displayName : user.displayName,
            photoURL: "colega0.png",
            emailVerified: user.emailVerified,
            difficulty: 1,
            mode: 1,
          }
          userRef.set(playerData, {
            merge: true
          })
          const record = this.dataService.createEmptyRecord(user.uid);
          this.dataService.createRecord(record);
      }
      this.saveInStorage(user)
        .subscribe((playerData) => {
          console.log("User stored successfully")
          ready.next(playerData);
        });
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