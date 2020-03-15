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
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { PlayComponent } from './components/play/play.component';
import { CardComponent } from './components/card/card.component';


const firebaseConfig = {
  apiKey: "AIzaSyBgQ5jksmMKzXjbfsy41R1sFemmMzc4_ck",
  authDomain: "kenji-83f0d.firebaseapp.com",
  databaseURL: "https://kenji-83f0d.firebaseio.com",
  projectId: "kenji-83f0d",
  storageBucket: "kenji-83f0d.appspot.com",
  messagingSenderId: "147387876256",
  appId: "1:147387876256:web:5525ed09f835a65a0e9ac5",
  measurementId: "G-05E4MSZPCE"
};


@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    PlayComponent,
    CardComponent,
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
  providers: [{
    provide: HTTP_INTERCEPTORS, 
    useClass: AuthInterceptorService, 
    multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
