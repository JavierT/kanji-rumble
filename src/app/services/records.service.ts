import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Irecord, RecordPeriod } from 'app/models/records.model.';
import { takeUntil } from 'rxjs/operators';


@Injectable()
export class RecordsService implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    recordsSubject: BehaviorSubject<Irecord[]>;
    recordsObs: Observable<Irecord[]>;

    constructor(private dataService: DataService) {
        console.log("on constructor records srvice")
        this.recordsSubject = new BehaviorSubject<Irecord[]>([]);
        this.recordsObs = this.recordsSubject.asObservable();
    }
    ngOnInit(): void {
        console.log("on init records srvice")
        this.recordsSubject = new BehaviorSubject<Irecord[]>([]);
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      }
    

    public getBestTimeRecords() {
        this.dataService.getRecords(RecordPeriod.ALL).pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            (resRecords) => {
                this.parseRecords(resRecords);
            }
        )
    }

    public getMonthTimeRecords() {
        const d = new Date();
        const monthDate = new Date(d.getFullYear(), d.getMonth(), 1);
        this.dataService.getRecordsFilterByDate(RecordPeriod.MONTHLY, monthDate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            (resRecords) => {
                this.parseRecords(resRecords);
            }
        )
    }

    public getWeekTimeRecords() {
        const d = new Date();
        const day = d.getDay();
        const weekDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?-6:1)-day);
        this.dataService.getRecordsFilterByDate(RecordPeriod.WEEKLY, weekDate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            (resRecords) => {
                this.parseRecords(resRecords);
            }
        )
    }

    private parseRecords(resRecords) {
        const dataSource =  this.sortDataSet(resRecords.map(e => {
            return  { id: e.payload.doc.id,
              ...e.payload.doc.data() as Irecord };
            }
          ));
        console.log("records parsed, datasource: ", dataSource)
        this.recordsSubject.next(dataSource);
    }

    sortDataSet(dataSet: Irecord[]) {
    return dataSet.sort((a, b) => b.score - a.score);
    }


}