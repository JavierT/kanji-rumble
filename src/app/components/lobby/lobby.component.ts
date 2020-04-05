import { Component, OnInit } from '@angular/core';
import { GameService } from 'app/services/game.service';
import { Difficulty } from 'app/models/enums';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

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

  play(level: string) {
    this.gameService.difficulty = level;
    this.router.navigate(['play']);
  }

  isThisLevelDisabled(level: string): boolean {
    return level === "Original";  
  }

}
