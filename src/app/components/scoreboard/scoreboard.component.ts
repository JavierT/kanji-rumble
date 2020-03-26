import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';
import { Player } from 'app/models/player.model';
import { forkJoin, combineLatest, pipe, Subject, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit, OnDestroy {

  allUsers: Map<string, Player>;
  subs: Subscription;
  mediaSubs: Subscription;
  playerSubs: Subscription;
  ready = false;
  displayedColumns: string[] = ['name', 'score', 'total_time', 'max_level', 'timestamp'];
  dataSource: Irecord[] = [];
  dataSourceWeek: Irecord[] = [];
  dataSourceMonth: Irecord[] = [];

  constructor(private dataService: DataService, public breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.allUsers = new Map<string, Player>();
    this.playerSubs = this.dataService.getPlayers().subscribe((resPlayers) => {
      resPlayers.map(e => {
        this.allUsers.set(e.payload.doc.id, {
              ...e.payload.doc.data() as Player });
      });
      console.log(this.allUsers)
      this.requestRecords();
    })
  }

  ngAfterContentInit() {
    this.mediaSubs = this.breakpointObserver
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.mediaSubs.unsubscribe();
    this.playerSubs.unsubscribe();
  }

  requestRecords() {
    const d = new Date();
    const day = d.getDay();
    const weekDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?-6:1)-day);
    const monthDate = new Date(d.getFullYear(), d.getMonth(), 1);
    this.subs = combineLatest(this.dataService.getTenBestRecords(), 
    this.dataService.getTenLastRecordsFilterByDate(weekDate), this.dataService.getTenLastRecordsFilterByDate(monthDate))
    .subscribe(([resRecords, resRecordsWeek, resRecordsMonth]) => {
      if (resRecords !== null && resRecordsWeek !== null && resRecordsMonth !== null) {
        this.dataSource =  this.sortDataSet(resRecords.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        ));
        this.dataSourceWeek = this.sortDataSet(resRecordsWeek.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        ));
        
        this.dataSourceMonth = this.sortDataSet(resRecordsMonth.map(e => {
          return  { id: e.payload.doc.id,
            username: this.getUserName(e.payload.doc.data().userId),
            ...e.payload.doc.data() as Irecord };
          }
        ));
        this.ready = true;
      }
    });
  }

  getUserName(uid) {
    const player = this.allUsers.get(uid);
    if (player !== undefined) {
      return player.displayName;
    } else {
      return "Tipo de incognito"
    }
  }

  sortDataSet(dataSet: Irecord[]) {
    return dataSet.sort((a, b) => b.score - a.score);
  }
}
