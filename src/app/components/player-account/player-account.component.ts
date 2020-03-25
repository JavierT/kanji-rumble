import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Player } from 'app/models/player.model';
import { MatSnackBar } from '@angular/material';
import { MyError } from 'app/models/my-error';
import { Router } from '@angular/router';


@Component({
  selector: 'app-player-account',
  templateUrl: './player-account.component.html',
  styleUrls: ['./player-account.component.scss']
})
export class PlayerAccountComponent implements OnInit {
  public playerData: Player;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.playerData = null;
  }

  ngOnInit() {
    this.authService.getUserData()
      .subscribe(
        (player) => this.playerData = player, 
        (error: MyError) => {
          this._snackBar.open(error.msg, 'Ok', {
            duration: 3000});
        }
      );
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
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 1500);
    });
  }

}
