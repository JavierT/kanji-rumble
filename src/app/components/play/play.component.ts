import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Icarta } from 'app/models/carta';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewInit {

  all_tiles;
  lifes = [true, true, true];
  currentLifes = 3;

  level = 4;

  timerValue = 30;
  spinnerValue = 100;
  timerStep = this.spinnerValue / this.timerValue;
  cardAData: Icarta[] = [];
  cardBData: Icarta[] = [];
  interval: any;
  solutionCard: Icarta;
  solved: boolean;

  constructor(private dataService: DataService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.dataService.getAllTiles().subscribe(
      data => {
        this.all_tiles = data;
        this.createRandomCards(this.level);
      });
  }

  createRandomCards(img_in_card: number) {
    /**
     * Problems detected> 
     *  - I can select the same cart twice
     *  - I can select two cards that are the same meaning
     */
    // Here I have all the tiles in all_tiles in a MAP sorted by
    // folder_name: array of image names
    const keys: string[] = Array.from(this.all_tiles.keys());
    const total_folders = this.all_tiles.size;
    const pick_random = (img_in_card * 2) - 1;
    // Here I'll store the picked ones
    const picked: Icarta[] = [];
    // Until double of number of tiles - 1, I pick
    for (let i = 0; i < pick_random; i++) {
      let random_index = Math.floor(Math.random() * (total_folders-1));
      // adding just a security control
      if (random_index < 0 || random_index > (keys.length -1)) {
        random_index = 0;
      };
      // Here I have a random folder
      const picked_key = keys[random_index];
      const img = this.getRandomImgInFolder(picked_key)
      picked.push({
        "folder": picked_key,
        "img" : img,
        "selected": false,
      })   
    }
    // I have already N -1
    this.cardAData = picked.splice(0, img_in_card);
    this.cardBData = picked.slice(0, picked.length);
    // Then I select one of the already selected ones to put it
    // in the cardB array. But there is a mistake because if I do 
    // that then it's too easy to find as it is the same. I think I
    // should get a same one in another folder. 
    let random_index = Math.floor(Math.random() * (img_in_card-1));
    this.solutionCard = this.cardAData[random_index];

    this.cardBData.push({
        "folder": this.cardAData[random_index].folder,
        "img" : this.cardAData[random_index].img,
        "selected": false,
    });
    // console.log('cardA: ', this.cardAData)
    // console.log('cardB: ', this.cardBData)
  }

  getRandomImgInFolder(key: string): string {
    // I get a random img name of the array of namnes for 
    // this folder
    const imgArray = this.all_tiles.get(key) as string[];
    const totalImgs = imgArray.length;
    const random_index = Math.floor(Math.random() * (totalImgs-1));
    // security control
    if (random_index < 0 || random_index >= totalImgs) {
      return imgArray[0];
    } else {
      return imgArray[random_index];
    }
  }

  ngAfterViewInit(): void {
    this.startCountdown();    
  }

  private resetContdown(seconds:number) {
    this.timerValue = seconds;
    this.spinnerValue = 100;
    this.timerStep = this.spinnerValue / this.timerValue;
    clearInterval(this.interval);
    this.startCountdown();
  }

  private startCountdown(){
    this.interval = setInterval(() => {
      this.timerValue--;
      this.spinnerValue -= this.timerStep; 
      if(this.timerValue < 0 ){
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
    const sel1 = this.getSelected(this.cardAData);
    const sel2 = this.getSelected(this.cardBData);
    if (sel1 !== null && sel2 !== null) {
      this.checkSolution(sel1, sel2)
    }
  }

  private getSelected(arrayTiles: Icarta[]): Icarta {
    for (const tile of arrayTiles) {
      if (tile.selected) {
        return tile;
      }
    }
    return null;
  }

  private checkSolution(sel1: Icarta, sel2: Icarta) {
    let msg = "";

    const firstCardSol = this.compareTiles(sel1, this.solutionCard);
    const secCardSol = this.compareTiles(sel2, this.solutionCard);

    if (firstCardSol && secCardSol) {
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

  private loseALife() {
    this.clearSelected()
    this.currentLifes -= 1;
    this.lifes[this.currentLifes] = false;
    if (this.currentLifes == 0) {
      this._snackBar.open("Has perdido", 'Ok', {
        duration: 4000,
      });
      this.router.navigateByUrl('/home');
    }
  }

  private nextLevel() {
    let seconds = 30;
    if (this.level === 10) {
      this.level = 10;
      if (seconds === 10) {
        seconds = 10;
      } else {
        seconds -= 5;
      }
    } else {
      this.level += 1
    }
    this.createRandomCards(this.level);
    this.resetContdown(seconds);
  }

  private compareTiles(tile1: Icarta, tile2: Icarta) {
    return tile1.img === tile2.img
      && tile1.folder === tile2.folder;
  }

  private clearSelected() {
    for (const tile of this.cardAData) {
        tile.selected = false;
    }
    for (const tile of this.cardBData) {
      tile.selected = false;
  }
  }
}
