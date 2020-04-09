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
  _difficulty: GameLevel;

  constructor(private dataService: DataService) {
    this.difficulty = null;
   }

  public set difficulty(value: GameLevel) {
    this._difficulty = value;
  }

  public get difficulty() {
    return this._difficulty;
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
    for (const level of this._mainInfo.levels) {
      if (level.levelId === this._difficulty.levelId) {
        return level;
      }
    }
    return this._mainInfo.levels[0];
  }

}
