import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss', './../auth.style.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  tryResendEmail() {
    this.authService.sendVerificationMail()
      .then((res) => {
        this._snackBar.open("El correo ha sido enviado correctamente", 'Ok', {
          duration: 3000});
      }).catch((error) => {
        console.log(error)
        this._snackBar.open(error, 'Ok', {
          duration: 3000});
    });
  }
}
