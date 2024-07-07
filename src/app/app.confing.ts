import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule], providers: [
        AuthInterceptor,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => provideAuth()), // Ajusta esto según la documentación de AngularFire
        provideFirestore(() => provideFirestore()),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppConfig { }
