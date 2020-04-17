import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Icarta, StatusCard } from 'app/models/carta';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { GameMechanics } from './game-mechanics';
import { AuthService } from 'app/services/auth.service';
import { Irecord } from 'app/models/records.model.';
import { Subscription } from 'rxjs';
import { GameService } from 'app/services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewInit, OnDestroy {

  ready = false;
  // Used to send the solution tile to the card component
  statusCard = StatusCard.HIDE;
  lives = [true, true, true];
  currentlives = 3;

  level = 4;
  correct = 0;
  intial_timer = 30;

  timerValue = this.intial_timer;
  spinnerValue = 100;
  diameterSpinner = 100;
  timerStep = this.spinnerValue / this.timerValue;

  interval: any;

  solved: boolean;

  score = 0;
  scoreBase = 5;
  total_time = 0;


  gameMechanics: GameMechanics;
  subsReady: Subscription;
  tilesSubs: Subscription;

  constructor(private dataService: DataService, 
              private _snackBar: MatSnackBar,
              private router: Router, 
              private authService: AuthService,
              private gameService: GameService) {
    this.gameMechanics = new GameMechanics();
   }

  ngOnInit() {
    this.prepareGame();
    if (window.innerWidth < 600) {
      this.diameterSpinner = 40;
    }
  }

  ngOnDestroy(): void {
    this.subsReady.unsubscribe();
    if (this.tilesSubs !== undefined) {
      this.tilesSubs.unsubscribe();
    }
  }


  ngAfterViewInit(): void {
  }

  private prepareGame() {
    this.tilesSubs = this.gameService.getData().subscribe((tiles) => {
      this.gameMechanics.setData(tiles);
      this.scoreBase = this.gameService.difficulty.multiplier;
      this.subscribeReady();
      this.createNewRound();
    });
  }

  private resetContdown() {
    this.timerValue = this.intial_timer;
    this.spinnerValue = 100;
    this.timerStep = this.spinnerValue / this.timerValue;
  }

  private subscribeReady() {
    this.subsReady = this.gameMechanics.ready.subscribe((res) => {
      this.ready = res;
      if (this.ready) {
        setTimeout(() => {
          this.statusCard = StatusCard.PLAY;
          this.startCountdown();
        }, 1000);
      }
    })
  }

  private createNewRound() {
    this.statusCard = StatusCard.HIDE;
    this.resetContdown();
    // Ask for new cards, the subscribe will do the rest
    this.gameMechanics.createRandomCards(this.level);
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
    clearInterval(this.interval);
    this.statusCard = StatusCard.FINISH;
    let msg = "";
    if (this.gameMechanics.isSolutionBetweenTiles(sel1, sel2)) {
      msg = "La solucion es correcta";
      setTimeout(() => {
        this.nextLevel();
      }, 1500);

    } else {
      msg = "La solucion no es correcta";
      this.loseALife();
    }
    this._snackBar.open(msg, 'Ok', {
      duration: 1500,
    });
  }


  private loseALife() {
    this.statusCard = StatusCard.SOLVE;
    this.currentlives -= 1;
    setTimeout(() => {
      // 3 seconds showing the result
      this.gameMechanics.clearSelected();
      this.lives[this.currentlives] = false;
      if (this.currentlives <= 0) {
          this._snackBar.open("Has perdido", 'Ok', {
            duration: 3000,
          });
          if (this.authService.guestMode) {
            this.router.navigate(['home'])
          } else {
            this.dataService.updateRecords(this.createRecord())
            this.router.navigate(['game-over'])
          }
        } else {
          this.createNewRound();         
        }
      }, 3500);
  }

  private nextLevel() {
    this.score += this.level * this.scoreBase;
    this.correct += 1;
    if (this.correct === 3) {
      this.correct = 0;
      if (this.level === 12) {
        this.level = 12;
        if (this.intial_timer === 10) {
          this.intial_timer = 10;
        } else {
          this.intial_timer -= 5;
        }
      } else {
        this.level += 1
      }
    }
    this.createNewRound(); 
  }

  private createRecord(): Irecord {
    const player = this.authService.userUid;
    return {
      userId: player,
      score: this.score,
      level : this.level,
      percent: 100,
      timestamp: new Date(),
      total_time : this.total_time,
      mode: this.gameService.difficulty.levelName,
    }
  }
 
}
