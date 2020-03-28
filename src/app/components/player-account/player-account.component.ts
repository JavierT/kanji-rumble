import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Player } from 'app/models/player.model';
import { MatSnackBar } from '@angular/material';
import { MyError } from 'app/models/my-error';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-player-account',
  templateUrl: './player-account.component.html',
  styleUrls: ['./player-account.component.scss']
})
export class PlayerAccountComponent implements OnInit, OnDestroy {
  public playerData: Player;
  public lastRecord: Irecord = null;
  private unsubscribe = new Subject<void>();

  constructor(private authService: AuthService, 
    private _snackBar: MatSnackBar, 
    private router: Router,
    private dataService: DataService) {
    this.playerData = null;
  }

  ngOnInit() {
    this.authService.getUserData()
      .pipe(takeUntil(this.unsubscribe)).subscribe(
        (player) => {
          this.playerData = player;
          this.dataService.getRecordByUserId(player.uid);
          this.dataService.lastRecord.pipe(takeUntil(this.unsubscribe))
            .subscribe((record) => {
            this.lastRecord = record;
          })
        }, 
        (error: MyError) => {
          this._snackBar.open(error.msg, 'Ok', {
            duration: 3000});
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
