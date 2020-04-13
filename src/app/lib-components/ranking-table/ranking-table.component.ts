import { Component, OnInit, Input } from '@angular/core';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { DataService } from 'app/services/data.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss']
})
export class RankingTableComponent{
  @Input() dataset: Irecord[]  = [];
  @Input() title: string = "Mejores puntuaciones";
  @Input() cols: string[] = ['name', 'score', 'total_time', 'max_level', 'mode', 'timestamp'];

  private matSort: MatSort;

  constructor() {
   }

   public isPodium(element: Irecord) {
     return element.id === this.dataset[0].id ||
      element.id === this.dataset[1].id ||
      element.id === this.dataset[2].id;
   }

   public getPodiumImg(element: Irecord) {
    let src = "";
    switch (element.id) {
      case this.dataset[0].id:
        src = "first";
        break;
      case this.dataset[1].id:
        src = "second";
        break;
      case this.dataset[2].id:
        src = "third";
        break;
      default:
        break;
    }
    return `/assets/img/${src}.png`
   }

   public getAvatar(avatar: string) {
     if (avatar !== undefined && avatar !== null) {
       return `./assets/img/avatars/${avatar}`;
     }
   }

}
