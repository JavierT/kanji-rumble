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
  colsKana = ['hiragana', 'katakana', 'readings'];
  colsKanji = ['calligraphy', 'print', 'picture', 'readings', 'translation'];
  lengthKana: number;

  lengthKanji: number;
  pageSizeKana: number=5;
  pageSizeKanji: number=5;
  pageSizeOptions = [5, 10, 20];
  dataSourceKana = new MatTableDataSource<string>();
  dataSourceKanji = new MatTableDataSource<string>();

  @ViewChild("MatPaginatorKana", {static: true}) paginatorKana;
  @ViewChild("MatPaginatorKanji", {static: true}) paginatorKanji;
  // @ViewChild(MatPaginatorKana, {static: true}) set matPaginator(paginator: MatPaginator) {
  //   this.dataSourceKana.paginator = paginator;
  // }
  // @ViewChild(MatPaginatorKanji, {static: true}) set matPaginator(paginator: MatPaginator) {
  //   this.dataSourceKana.paginator = paginator;
  // }

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getGameMainInfos().subscribe(
      (res: GameInfo) => {
        this.parseMainInfo(res);
      }
    )
  }

  ngAfterViewInit() {
    this.dataSourceKana.paginator = this.paginatorKana;
    this.dataSourceKanji.paginator = this.paginatorKanji;
  }

  public parseMainInfo(gameInfo: GameInfo) {
    console.log(gameInfo);
    for (const level of gameInfo.levels) {
      if (level.levelId === 0) {// Kana complete
        this.dataSourceKana.data  = level.mapImagesByFolder.get('hiragana');
        this.lengthKana = level.mapImagesByFolder.get('hiragana').length;
      } else if (level.levelId === 3) {// N5 complete
        this.dataSourceKanji.data  = level.mapImagesByFolder.get('calligraphy');
        this.lengthKanji = level.mapImagesByFolder.get('calligraphy').length;
      }
    }

  }

  public getImg(gameFolder: string, folder: string, element: string) {
    return `./assets/data/${gameFolder}/${folder}/${element}.jpg`;
  }

}
