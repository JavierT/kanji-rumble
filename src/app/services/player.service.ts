import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { Player } from 'app/models/player.model';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  private players = new Map<string, Player>();
  private unkownPlayer: Player = {
    uid: '',
    displayName: "Tipo de incognito",
    email: "",
    emailVerified: true,
    photoURL: "colega0.png",
  }

  constructor(private dataService: DataService) {
    this.dataService.getPlayers().pipe(takeUntil(this.unsubscribe$))
    .subscribe((resPlayers) => {
      resPlayers.map(e => {
        this.players.set(e.payload.doc.id, {
              ...e.payload.doc.data() as Player });
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getUserData(uid): Player {
    const player = this.players.get(uid);
    if (player !== undefined) {
      return player;
    } else {
      return this.unkownPlayer;
    }
  }
}
