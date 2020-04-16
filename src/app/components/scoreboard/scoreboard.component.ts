import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { RecordPeriod } from 'app/models/records.model.';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  //providers: [RecordsService],
})
export class ScoreboardComponent implements OnInit, OnDestroy {

  mediaSubs: Subscription;
  displayedColumns: string[] = ['avatar', 'name', 'score', 'total_time', 'max_level', 'mode', 'timestamp'];
  public enumRecordPeriod = RecordPeriod;

  constructor(public breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.mediaSubs = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.displayedColumns = ['avatar', 'name', 'score', 'total_time', 'mode'];
        }
      });
  }


  ngOnDestroy(): void {
    this.mediaSubs.unsubscribe();
  }

  
}
