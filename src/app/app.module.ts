import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ionic-auth-app-eaff8',
        appId: '1:726768556363:web:e3b6d322ba62bff3b1f0ce',
        storageBucket: 'ionic-auth-app-eaff8.appspot.com',
        apiKey: 'AIzaSyDD4rNct4NTGvjk82C9yDDees-wp9_uY98',
        authDomain: 'ionic-auth-app-eaff8.firebaseapp.com',
        messagingSenderId: '726768556363',
        measurementId: 'G-CS4ZES5P8Z',
      })
    ),
    provideAuth(() => getAuth()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
