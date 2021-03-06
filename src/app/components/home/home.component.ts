import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Icarta, StatusCard } from 'app/models/carta';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { GameService } from 'app/services/game.service';
import { take } from 'rxjs/operators';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {

  carta1ejemplo: Icarta[] = [];
  carta2ejemplo: Icarta[] = [];
  solutionTile1: Icarta;
  solutionTile2: Icarta;
  askForHelp: number = 0;
  showSolution: boolean = false;
  solved = false;
  subscription: Subscription;
  mainIfnoSubs: Subscription;

  status = StatusCard.HIDE;

  constructor(
    private dataService: DataService, 
    private _snackBar: MatSnackBar, 
    private gameService: GameService,
    private authService: AuthService) {
  }

  ngOnInit() {
    // If we are in guest mode, we show him the go to register info. 
    this.solved = this.authService.guestMode ? true : false;
    this.authService.guestMode = false;
    this.subscription = this.dataService.getCardExample()
      .subscribe((res) => {

        for (const carta of res.card1) {
          this.carta1ejemplo.push(carta as Icarta);
        }
        for (const carta of res.card2) {
          this.carta2ejemplo.push(carta as Icarta);
        }
        this.solutionTile1 = res.solution1 as Icarta;
        this.solutionTile2 = res.solution2 as Icarta;
        setTimeout(() => {
          this.status = StatusCard.PLAY;
        }, 2000);
      })

    
  this.mainIfnoSubs = this.dataService.getGameMainInfos().pipe(take(1)).subscribe(
      data => this.gameService.setMainInfos(data));
        
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.mainIfnoSubs.unsubscribe();
  }

  selectTile(where: Icarta[], index: number) {
    for (const tile of where) {
      tile.selected = false;
    }
    where[index].selected = true;
  }

  doNothing(tile: Icarta): void { }

  private getSelected(arrayTiles: Icarta[]): Icarta {
    for (const tile of arrayTiles) {
      if (tile.selected) {
        return tile;
      }
    }
    return null;
  }

  public checkSolution() {
    let msg = "";
    const sel1 = this.getSelected(this.carta1ejemplo);
    const sel2 = this.getSelected(this.carta2ejemplo);
    if (sel1 === null || sel2 === null) {
      msg = "Te has olvidado de seleccionar una imagen";
    } else {
      if (sel1.img === sel2.img) {
        msg = "La solucion es correcta";
        setTimeout(() => {
          this.solved = true;
        }, 2000);

      } else {
        msg = "La solucion no es correcta";
      }
    }
    this._snackBar.open(msg, 'Ok', {
      duration: 4000,
    });
  }

  public giveSolution() {
    for (const tile of this.carta1ejemplo) {
      if (tile.img  === this.solutionTile1.img) {
        tile.selected = true;
      } else {
        tile.selected = false;
      }
    }
    for (const tile of this.carta2ejemplo) {
      if (tile.img  === this.solutionTile2.img) {
        tile.selected = true;
      } else {
        tile.selected = false;
      }
    }
    this.showSolution = true;
    setTimeout(() => {
      this.clearSelected();
      this._snackBar.open("Ahora es tu turno", 'Ok', {
        duration: 2000,
      });
    }, 15000);
  }

  private clearSelected() {
    for (const tile of this.carta1ejemplo) {
        tile.selected = false;
    }
    for (const tile of this.carta2ejemplo) {
      tile.selected = false;
  }
  }
}