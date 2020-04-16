import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { take } from 'rxjs/operators';
import { GameInfo, GameLevel } from 'app/models/gameInfo';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-cheat-sheet',
  templateUrl: './cheat-sheet.component.html',
  styleUrls: ['./cheat-sheet.component.scss']
})
export class CheatSheetComponent implements OnInit, AfterViewInit {
  levelComplete: GameLevel;
  cols = ['calligraphy', 'print', 'picture', 'readings', 'translation'];
  
  length: number;
  pageSize: number=5;
  pageSizeOptions = [5, 10, 50];
  dataSource = new MatTableDataSource<string>();

  @ViewChild(MatPaginator, {static: true}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.levelComplete = null;
    
    this.dataService.getGameMainInfos().subscribe(
      (res: GameInfo) => {
        this.parseMainInfo(res);
      }
    )
  }

  ngAfterViewInit() {
  //this.dataSource.paginator = this.paginator;
  }

  public parseMainInfo(gameInfo: GameInfo) {
    console.log(gameInfo);
    for (const level of gameInfo.levels) {
      if (level.levelId === 2) {// N5 complete
        this.levelComplete = level;
        this.dataSource.data  = level.mapImagesByFolder.get('calligraphy');
        this.length= level.mapImagesByFolder.get('calligraphy').length;
        break;
      }
    }

  }

  public getImg(folder: string, element: string) {
    return `./assets/data/tiles/${folder}/${element}.jpg`;
  }

}
