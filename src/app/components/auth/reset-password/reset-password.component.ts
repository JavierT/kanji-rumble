import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', './../auth.style.scss']
})
export class ResetPasswordComponent implements OnInit {
  error: string = null;

  constructor(private authService: AuthService, 
    private router: Router, private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  tryforgotPassword(form) {
    this.authService.forgotPassword(form.value.email)
      .then(() => {
        this._snackBar.open("Te hemos enviado un link para resetear tu contraseña a tu correo.", 'Ok', {
          duration: 3000});
      }).catch((error) => {
        this._snackBar.open("Ha surgido un error", 'Ok', {
          duration: 3000});
      })
  }
}
