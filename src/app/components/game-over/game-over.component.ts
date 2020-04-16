import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit, OnDestroy {
  oldRecord: Irecord = null;
  lastRecord: Irecord = null;
  diffScore: number = null;
  diffTime: number  = null;
  oldRecordSub: Subscription;
  lastRecordSub: Subscription;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.oldRecordSub = this.dataService.oldRecordObs.subscribe((record) => {
      this.oldRecord = record});
    this.lastRecordSub = this.dataService.lastRecordObs.subscribe((record) => {
      this.lastRecord = record;
      this.createDiff();
    });
   

  }
  createDiff() {
    if (this.oldRecord !== null && this.lastRecord !== null) {
      this.diffScore = this.lastRecord.score - this.oldRecord.score;
      if (this.oldRecord.total_time !== 0) {
        this.diffTime = this.oldRecord.total_time - this.lastRecord.total_time;
      }
    }
  }

  ngOnDestroy() {
    this.oldRecordSub.unsubscribe();
    this.lastRecordSub.unsubscribe();
  }
  
}
