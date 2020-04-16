import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Irecord, RecordPeriod } from 'app/models/records.model.';
import { combineLatest, Observable } from 'rxjs';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { PlayerService } from 'app/services/player.service';
import { RecordsService } from 'app/services/records.service';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
  styleUrls: ['./ranking-table.component.scss'],
  providers: [RecordsService]
})
export class RankingTableComponent implements OnInit {
  @Input() data: RecordPeriod;
  @Input() title: string = "Mejores puntuaciones";
  @Input() cols: string[] = ['name', 'score', 'total_time', 'max_level', 'mode', 'timestamp'];

  private matSort: MatSort;

  private podium: string[] = [];
  length: number;
  pageSizeOptions = [5, 10, 50];
  dataSource = new MatTableDataSource<Irecord>();

  @ViewChild(MatPaginator, {static: true}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private playerService: PlayerService, private recordsService: RecordsService) {
   }

  ngOnInit(): void {

    if (this.data === RecordPeriod.WEEKLY) {
      this.recordsService.getWeekTimeRecords();
    } else if (this.data === RecordPeriod.MONTHLY) {
      this.recordsService.getMonthTimeRecords();
    } else {
      this.recordsService.getBestTimeRecords();
    }
    this.recordsService.recordsObs.subscribe((records) => {
      this.dataSource.data = records;
      this.length = records.length;
      records.slice(0, 3).map(
        i => {
          this.podium.push(i.userId);
        }
      )
    })
  }

   public isPodium(element: Irecord) {
     return this.podium.indexOf(element.userId) >= 0;

   }

   public getPodiumImg(element: Irecord) {
    let src = "";
    let pos = this.podium.indexOf(element.userId);
    switch (pos) {
      case 0:
        src = "first";
        break;
      case 1:
        src = "second";
        break;
      case 2:
        src = "third";
        break;
      default:
        break;
    }
    return `/assets/img/${src}.png`
   }

   public getAvatar(userId: string) {
    const player = this.playerService.getUserData(userId)
    return `./assets/img/avatars/${player.photoURL}`;
   }

   public getPlayerName(userId: string) {
    const player = this.playerService.getUserData(userId)
    return player.displayName;
  }

}
