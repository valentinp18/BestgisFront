import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, from, switchMap, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(userCredential => {
        if (userCredential.user) {
          return from(userCredential.user.getIdToken());
        } else {
          return of(null);
        }
      }),
      tap(token => {
        if (token) {
          sessionStorage.setItem('token', token);
        }
      })
    );
  }

  logout(): Promise<void> {
    sessionStorage.removeItem('token');
    return this.afAuth.signOut();
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }
}