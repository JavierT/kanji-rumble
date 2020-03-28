import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'kanji';
  private userSub: Subscription;
  public isAuthenticated = false;

  @ViewChild('sidenav', {static:true}) public myNav: MatSidenav;

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

  login(){
    this.myNav.toggle();
    this.router.navigate(['login']);
  }

  logout(){
    this.authService.signOut();
    this.myNav.close();
    this.router.navigate(['login']);
  }

}
