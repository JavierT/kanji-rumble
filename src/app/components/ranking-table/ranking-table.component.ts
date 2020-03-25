import { Component, OnInit, Input } from '@angular/core';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { DataService } from 'app/services/data.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss']
})
export class RankingTableComponent{
  @Input() dataset: Irecord[]  = [];
  @Input() title: string = "Mejores puntuaciones";
  @Input() cols: string[] = ['name', 'score', 'total_time', 'max_level', 'timestamp'];

  constructor() { }


}
