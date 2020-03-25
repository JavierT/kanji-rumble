import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Icarta } from 'app/models/carta';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { GameMechanics } from './game-mechanics';
import { AuthService } from 'app/services/auth.service';
import { Irecord } from 'app/models/records.model.';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewInit, OnDestroy {

  ready = false;
  lives = [true, true, true];
  currentlives = 3;

  level = 4;
  correct = 0;
  intial_timer = 30;

  timerValue = this.intial_timer;
  spinnerValue = 100;
  diameterSpinner = 100;
  timerStep = this.spinnerValue / this.timerValue;
  //cardAData: Icarta[] = [];
  //cardBData: Icarta[] = [];
  interval: any;
  //solutionCard: Icarta;
  solved: boolean;

  score = 0;
  total_time = 0;

  // Used to send the solution tile to the card component
  sendSolutionTile: Icarta = null;
  gameMechanics: GameMechanics;
  subsReady: Subscription;
  recordSubs: Subscription;

  constructor(private dataService: DataService, private _snackBar: MatSnackBar, private router: Router, private authService: AuthService) {
    this.gameMechanics = new GameMechanics();
   }

  ngOnInit() {
    
    this.dataService.getAllTiles().subscribe(
      data => {
        this.gameMechanics.setData(data);
        this.subsReady = this.gameMechanics.ready.subscribe((res) => {
          this.ready = res;
          if (this.ready) {
            this.startCountdown();
          }
        })
        this.gameMechanics.createRandomCards(this.level);
      });
    if (window.innerWidth < 600) {
      this.diameterSpinner = 40;
    }
  }

  ngOnDestroy(): void {
    this.subsReady.unsubscribe();
    //this.recordSubs.unsubscribe();
  }


  ngAfterViewInit(): void {
  }

  private resetContdown(seconds: number) {
    this.timerValue = seconds;
    this.spinnerValue = 100;
    this.timerStep = this.spinnerValue / this.timerValue;
    clearInterval(this.interval);
    this.startCountdown();
  }

  private startCountdown() {
    this.interval = setInterval(() => {
      this.timerValue--;
      this.total_time++;
      this.spinnerValue -= this.timerStep;
      if (this.timerValue < 0) {
        // The code here will run when
        // the timer has reached zero.
        this.timeout();
      };
    }, 1000);
  };

  private timeout() {
    clearInterval(this.interval);
    this.loseALife();
  }

  public checkIfSuccess(event) {
    const sel1 = this.gameMechanics.getSelectedCardA();
    const sel2 = this.gameMechanics.getSelectedCardB();
    if (sel1 !== null && sel2 !== null) {
      this.checkSolution(sel1, sel2)
    }
  }  

  private checkSolution(sel1: Icarta, sel2: Icarta) {
    let msg = "";
    if (this.gameMechanics.isSolutionBetweenTiles(sel1, sel2)) {
      msg = "La solucion es correcta";
      clearInterval(this.interval);
      setTimeout(() => {
        this.nextLevel();
      }, 2000);

    } else {
      msg = "La solucion no es correcta";
      this.loseALife();
    }
    this._snackBar.open(msg, 'Ok', {
      duration: 2000,
    });
  }

  private setSolution() {
    // TODO user selection to red, good one to green
    this.sendSolutionTile = this.gameMechanics.solutionCard;
  }

  private loseALife() {
    clearInterval(this.interval);
    this.setSolution();
    this.currentlives -= 1;
    setTimeout(() => {
      // 3 seconds showing the result
      this.gameMechanics.clearSelected();
      this.sendSolutionTile = null;
      this.lives[this.currentlives] = false;
      if (this.currentlives == 0) {
          this._snackBar.open("Has perdido", 'Ok', {
            duration: 4000,
          });
          this.dataService.saveRecord(this.createRecord())
          this.router.navigate(['game-over'])
          // this.recordSubs = this.dataService.lastRecord.subscribe(
          //   (res) => {
          //     console.log("record", res);
          //     this.router.navigate(['game-over'])
          //   }
          // );
        } else {
          this.gameMechanics.createRandomCards(this.level);
          this.resetContdown(this.intial_timer);
        }
      }, 3500);
  }

  private nextLevel() {
    this.score += this.level * 5;
    this.intial_timer = 30;
    this.correct += 1;
    if (this.correct === 3) {
      this.correct = 0;
      if (this.level === 10) {
        this.level = 10;
        if (this.intial_timer === 10) {
          this.intial_timer = 10;
        } else {
          this.intial_timer -= 5;
        }
      } else {
        this.level += 1
      }
    }
    this.gameMechanics.createRandomCards(this.level);
    this.resetContdown(this.intial_timer);
  }


  private createRecord(): Irecord {
    const player = this.authService.userUid;
    // if (user === null) {
    //   this.authService.getUserData()
    //   .subscribe(
    //     (player) => user = player.uid, 
    //     (error) => {
    //       this._snackBar.open("Lo sentimos, no se ha podido guardar tu record", 'Ok', {
    //         duration: 3000});
    //       return null;
    //     }
    //   );
    // }
    return {
      "userId": player,
      "score": this.score,
      "level" : this.level,
      "percent": 100,
      "timestamp": new Date(),
      "total_time" : this.total_time
    }
  }
}
