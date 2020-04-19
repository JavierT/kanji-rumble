import { Component, OnInit } from '@angular/core';
import { GameService } from 'app/services/game.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { GameLevel } from 'app/models/gameInfo';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  //difficultyLevels = [];
  subs: Subscription;
  difficultyLevels$: Observable<GameLevel[]>

  constructor(
    private gameService: GameService, 
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.difficultyLevels$ = this.gameService.getLevels();
  }

  play(level: GameLevel) {
    this.gameService.difficulty = level;
    this.router.navigate(['play']);
  }

  isThisLevelDisabled(level: GameLevel): boolean {    
    if (this.authService.guestMode) {
      return level.levelId >= 2;
    };
    return false;
  }

}
