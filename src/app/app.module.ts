import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {MaterialModule} from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';

// Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { PlayComponent } from './components/play/play.component';
import { CardComponent } from './lib-components/card/card.component';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { PlayerAccountComponent } from './components/player-account/player-account.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { MinuteSecondsPipe } from './pipes/minute-seconds.pipe';
import { RankingTableComponent } from './lib-components/ranking-table/ranking-table.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { SelectProfilePictureComponent } from './lib-components/select-profile-picture/select-profile-picture.component';
import { CheatSheetComponent } from './components/cheat-sheet/cheat-sheet.component';
import { DataLoaderComponent } from './lib-components/data-loader/data-loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/loader.interceptor';

const firebaseConfig = {
  apiKey: "AIzaSyA4AGlXbkDg9KUwTDAX7IpLHMVjiLzViqE",
  authDomain: "kanjirumble-9d2fa.firebaseapp.com",
  databaseURL: "https://kanjirumble-9d2fa.firebaseio.com",
  projectId: "kanjirumble-9d2fa",
  storageBucket: "kanjirumble-9d2fa.appspot.com",
  messagingSenderId: "990671350353",
  appId: "1:990671350353:web:2a4e5ad8aa872cbc6da670",
  measurementId: "G-H7VTVBCB7C"
};

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    PlayComponent,
    CardComponent,
    RegisterComponent,
    ResetPasswordComponent,
    PlayerAccountComponent,
    VerifyEmailComponent,
    ScoreboardComponent,
    GameOverComponent,
    MinuteSecondsPipe,
    RankingTableComponent,
    LobbyComponent,
    SelectProfilePictureComponent,
    CheatSheetComponent,
    DataLoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage,
  ],
  entryComponents: [
    SelectProfilePictureComponent
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
