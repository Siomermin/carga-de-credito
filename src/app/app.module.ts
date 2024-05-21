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
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyDwL5zmskNsSKUP27bpoO62hu9dDqdVRpU",
        authDomain: "carga-credito-5f757.firebaseapp.com",
        projectId: "carga-credito-5f757",
        storageBucket: "carga-credito-5f757.appspot.com",
        messagingSenderId: "406985157719",
        appId: "1:406985157719:web:b86ebc32376e76e5e24712",
        measurementId: "G-E740GDHS40"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
