import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'app/services/auth.service';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './../auth.style.scss']
})
export class LoginComponent implements OnInit {
  error: string = null;

  constructor(private authService: AuthService, private dataService: DataService,
    private router: Router, private route: ActivatedRoute,
    private _snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.signIn(form.value.email, form.value.password)
      .then((res) => this.doActionsAfterLogin())
      .catch((error) => {
        console.log("login component, error ", error)
        form.value.password = '';
        this._snackBar.open(error.msg, 'Ok', {
          duration: 3000
        });
      });
  }

  tryGoogleAuth() {
    this.authService.googleAuth()
      .then((res) => this.doActionsAfterLogin())
      .catch((error) => {
        console.log(error)
        this._snackBar.open('Autentificación con Google fallida', 'Ok', {
          duration: 3000
        });
    });
  }

  doActionsAfterLogin() {
    console.log("Successful login")
    this.dataService.getRecordByUserId(this.authService.userUid);
    this.cdr.detectChanges();
    this.router.navigate(['account']);
  }

signOut() {
  this.authService.signOut();
}

guestMode() {
  this.authService.guestMode = true;
  console.log('guest mode')
  this.router.navigate(['lobby']);
}

}
