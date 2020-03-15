import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Icarta } from 'app/models/carta';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  carta1ejemplo: Icarta[] = [];
  carta2ejemplo: Icarta[] = [];
  solutionTile1: Icarta;
  solutionTile2: Icarta;
  askForHelp: number = 0;
  showSolution: boolean = false;

  constructor(private dataService: DataService, private _snackBar: MatSnackBar) {
   }

  ngOnInit() {
    this.dataService.getCardExample()
      .subscribe((res) => {
          
          for (const carta of res.card1) {
            this.carta1ejemplo.push(carta as Icarta);
          }
          for (const carta of res.card2) {
            this.carta2ejemplo.push(carta as Icarta);
          }
          this.solutionTile1 = res.solution1 as Icarta;
          this.solutionTile2 = res.solution2 as Icarta;
      })
  }

  getImgSrc(carta: Icarta) {
    return `/assets/data/${carta.folder}/${carta.img}.jpg`;
  }

  selectTile(where:Icarta[], index: number) {
    for (const tile of where) {
      tile.selected = false;
    }
    where[index].selected = true;
  }

  private getSelected(arrayTiles:Icarta[]): Icarta {
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
      const firstCardSol = this.compareTiles(sel1, this.solutionTile1);
      const secCardSol = this.compareTiles(sel2, this.solutionTile2);

      if (firstCardSol && secCardSol) {
        msg = "La solucion es correcta";
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
      if (this.compareTiles(tile, this.solutionTile1)) {
        tile.selected = true;
      } else {
        tile.selected = false;
      }
    }
    for (const tile of this.carta2ejemplo) {
      if (this.compareTiles(tile, this.solutionTile2)) {
        tile.selected = true;
      } else {
        tile.selected = false;
      }
    }
    this.showSolution = true;
  }

  private compareTiles(tile1: Icarta, tile2: Icarta) {
    return tile1.img === tile2.img 
      && tile1.folder === tile2.folder;
  }
}