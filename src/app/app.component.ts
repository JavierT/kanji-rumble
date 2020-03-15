import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'kanji';
  private userSub: Subscription;
  public isAuthenticated = false;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !user ? false : true;
      }
    )
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}
