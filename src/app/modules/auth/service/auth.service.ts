import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, from, switchMap, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<firebase.User | null> = new BehaviorSubject<firebase.User | null>(null);
  user$: Observable<firebase.User | null> = this.userSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userSubject.next(user);
        this.updateUserToken(user);
      } else {
        this.userSubject.next(null);
        localStorage.removeItem('user');
      }
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<string> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential: firebase.auth.UserCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.checkUserStatus(user);
        } else {
          return throwError(() => new Error('Error de autenticación'));
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  private checkUserStatus(user: firebase.User): Observable<string> {
    return this.firestore.doc(`users/${user.uid}`).get().pipe(
      switchMap(userDoc => {
        if (userDoc.exists) {
          const userData = userDoc.data() as DocumentData;
          if (userData && userData['estado'] === 'activo') {
            return this.updateUserToken(user);
          } else {
            return throwError(() => new Error('Usuario inactivo'));
          }
        } else {
          return this.createUserDocument(user).pipe(
            switchMap(() => this.updateUserToken(user))
          );
        }
      })
    );
  }

  private updateUserToken(user: firebase.User): Observable<string> {
    return from(user.getIdToken()).pipe(
      tap(token => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      })
    );
  }

  private createUserDocument(user: firebase.User): Observable<void> {
    const userRef = this.firestore.doc(`users/${user.uid}`);
    const userData = {
      email: user.email,
      estado: 'activo',
    };
    return from(userRef.set(userData));
  }

  resetPassword(email: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
      catchError(error => {
        if (error.code === 'auth/user-not-found') {
          return throwError(() => new Error('No existe una cuenta asociada a este correo electrónico.'));
        }
        return throwError(() => error);
      })
    );
  }

  logout(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return this.afAuth.signOut();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.user$;
  }
}