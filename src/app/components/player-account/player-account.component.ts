import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Player, PlayerUpdate } from 'app/models/player.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MyError } from 'app/models/my-error';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { SelectProfilePictureComponent } from 'app/lib-components/select-profile-picture/select-profile-picture.component';


@Component({
  selector: 'app-player-account',
  templateUrl: './player-account.component.html',
  styleUrls: ['./player-account.component.scss']
})
export class PlayerAccountComponent implements OnInit, OnDestroy {
  private playerId: string;
  public lastRecord: Irecord = null;
  private unsubscribe = new Subject<void>();
  public playerData$: Observable<Player>;

  constructor(private authService: AuthService, 
    private _snackBar: MatSnackBar, 
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog) {
    this.playerId = null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SelectProfilePictureComponent, {
      //width: "70%",
      //data: this.playerData.photoURL,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was clos  ed', result);
      
      if (result !== null) {
        const playerUpdate: PlayerUpdate = {
          photoURL: result
        }
        this.dataService.updatePlayer(this.playerId, playerUpdate)
          .subscribe(
            (next) => {
              const playerDataSubject = this.authService.getUserData();
              this.playerData$ = playerDataSubject.asObservable();
              console.log("data well saved")
            },
            (error: MyError) => {
                this._snackBar.open(error.msg, 'Ok', {
                  duration: 3000});
            }
        );
      }
    });
  }

  ngOnInit() {
    const playerDataSubject = this.authService.getUserData();
    this.playerData$ = playerDataSubject.asObservable();
    playerDataSubject.pipe(takeUntil(this.unsubscribe)).subscribe(
        (player) => {
          console.log("player: ", player)
          this.playerId = player.uid;
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

  saveChanges() {
    
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

  public getAvatar(avatar: string) {
    return  this.dataService.getAvatar(avatar);
  }
}
