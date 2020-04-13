import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { PlayComponent } from './components/play/play.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { PlayerAccountComponent } from './components/player-account/player-account.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { CheatSheetComponent } from './components/cheat-sheet/cheat-sheet.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'reset-psw', component: ResetPasswordComponent },
  { path: 'account', component: PlayerAccountComponent, canActivate: [AuthGuard] },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard] },
  { path: 'scoreboard', component: ScoreboardComponent, canActivate: [AuthGuard] },
  { path: 'game-over', component: GameOverComponent, canActivate: [AuthGuard] },
  { path: 'cheat-sheet', component: CheatSheetComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
