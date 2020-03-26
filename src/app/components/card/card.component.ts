import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Icarta } from 'app/models/carta';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() cardData: Icarta[];
  @Input() showSolution?: Icarta = null;
  @Output() selected: EventEmitter<Icarta> = new EventEmitter<Icarta>();

  constructor() { }

  ngOnInit() {
  }

  getImgSrc(carta: Icarta) {
    return `./assets/data/${carta.folder}/${carta.img}.jpg`;
  }

  selectTile(where: Icarta[], index: number) {
    for (const tile of where) {
      tile.selected = false;
    }
    where[index].selected = true;
    this.selected.emit(where[index]);
  }

  isShowSolutionActive(tile: Icarta): boolean {
    if (this.showSolution === null) {
      return false;
    } else {
      return this.showSolution.img === tile.img;
    }  

  }

  
}
