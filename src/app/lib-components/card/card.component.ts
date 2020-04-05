import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Icarta, StatusCard } from 'app/models/carta';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() cardData: Icarta[];
  @Input() status: StatusCard;
  @Output() selected: EventEmitter<Icarta> = new EventEmitter<Icarta>();

  public modDev = false;

  constructor() { }

  ngOnInit() {
  }

  isFlippedStatus() {
    return this.status === StatusCard.HIDE;
  }

  getImgSrc(carta: Icarta) {
    return `./assets/data/${carta.levelFolder}/${carta.folder}/${carta.img}.jpg`;
  }

  selectTile(where: Icarta[], index: number) {
    if (this.status === StatusCard.PLAY) {
      for (const tile of where) {
        tile.selected = false;
      }
      where[index].selected = true;
      this.selected.emit(where[index]);
    }
  }

  isShowSolutionActive(tile: Icarta): boolean {
    if (this.status === StatusCard.SOLVE) {
      return tile.solution;
    }
  }

  
}
