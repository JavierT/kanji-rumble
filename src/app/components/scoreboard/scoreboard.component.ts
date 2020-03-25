import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { forkJoin, combineLatest } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  allUsers: Map<string, Player>;

  constructor(private dataService: DataService, public breakpointObserver: BreakpointObserver) { }

  displayedColumns: string[] = ['name', 'score', 'total_time', 'max_level', 'timestamp'];
  dataSource: Irecord[] = [];
  dataSourceWeek: Irecord[] = [];
  dataSourceMonth: Irecord[] = [];

  ngOnInit() {
    const d = new Date();
    const day = d.getDay();
    const weekDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?-6:1)-day);
    const monthDate = new Date(d.getFullYear(), d.getMonth(), 1);
    this.allUsers = new Map<string, Player>();
    combineLatest(this.dataService.getPlayers(), this.dataService.getTenBestRecords(), 
    this.dataService.getTenLastRecordsFilterByDate(weekDate), this.dataService.getTenLastRecordsFilterByDate(monthDate))
    .subscribe(([resPlayer, resRecords, resRecordsWeek, resRecordsMonth]) => {
      if (resPlayer !== null && resRecords !== null) {
        resPlayer.map(e => {
          this.allUsers.set(e.payload.doc.id, {
                ...e.payload.doc.data() as Player });
        });
        this.dataSource = resRecords.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        );
        console.log(this.dataSource)
        this.dataSourceWeek = resRecordsWeek.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        );
        this.dataSourceMonth = resRecordsMonth.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        );
      }
    });
  }

  ngAfterContentInit() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(
            'Matches small viewport or handset in portrait mode'
          );
          this.displayedColumns = ['name', 'score', 'total_time', 'timestamp'];
        }
      });
  }

  getUserName(uid) {
    return this.allUsers.get(uid).displayName;
  }
}
