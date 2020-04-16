import { Injectable } from '@angular/core';
import { GameInfo, GameLevel } from 'app/models/gameInfo';
import { DataService } from './data.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  _mainInfo: GameInfo;
  _difficulty: GameLevel = null;

  constructor(private dataService: DataService) {
   }

  public set difficulty(value: GameLevel) {
    if(value === null || value === undefined) {
      return;
    }
    this._difficulty = value;
    localStorage.setItem('difficulty', JSON.stringify(
      {
        multiplier: value.multiplier,
        levelId: value.levelId,
        levelName: value.levelName
      }
    ));
  }

  public get difficulty() {
    if (this._difficulty !== null) {
      return this._difficulty;
    } else {
      const diff = JSON.parse(localStorage.getItem('difficulty'));
      if (diff !== null) {
        this._difficulty = diff;
      }
      return diff
    }
  }

  public hasData() {
    return this._mainInfo !== null && this._mainInfo !== undefined;
  }


  setMainInfos(data: GameInfo): void {
    this._mainInfo = data;
  }

  waitForData() {
    return new Observable(observer => {
      if (this._mainInfo === null || this._mainInfo === undefined) {
        this.dataService.getGameMainInfos().pipe(take(1)).subscribe(
          data => {
            this.setMainInfos(data);
            observer.next(true);
          }
        );
      } else {
        observer.next(true);
      }
    });
  }

  getLevels(): Observable<String[]> {
    return this.waitForData().pipe(map(ready => {
      let levels = [];
      for (const level of this._mainInfo.levels) {
        levels.push(level);
      }
      levels.sort((a, b) => a.multiplier - b.multiplier)
      return levels;
      })
    );
  }

  getData(): Observable<Map<string, string[]>> {
    return this.waitForData().pipe(map(ready => {
      const level = this.getDifficultyLevel();
      return level.mapImagesByFolder;
      })
    );
  }

  private getDifficultyLevel() {
    if(this.difficulty !== null) {
      for (const level of this._mainInfo.levels) {
        if (level.levelId === this.difficulty.levelId) {
          return level;
        }
      }
    }
    return this._mainInfo.levels[0];
  }

}
