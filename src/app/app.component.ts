import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'kanji';
  private userSub: Subscription;
  public isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {

  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logout(){
    this.authService.signOut();
  }

}
