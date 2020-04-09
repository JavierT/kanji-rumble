import { Component, OnInit } from '@angular/core';
import { GameService } from 'app/services/game.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { GameLevel } from 'app/models/gameInfo';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  //difficultyLevels = [];
  subs: Subscription;
  difficultyLevels$: Observable<String[]>

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.difficultyLevels$ = this.gameService.getLevels();
  }

  play(level: GameLevel) {
    this.gameService.difficulty = level;
    this.router.navigate(['play']);
  }

  isThisLevelDisabled(level: GameLevel): boolean {
    return level.levelName === "Original";  
  }

}
