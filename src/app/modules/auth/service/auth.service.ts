import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, from, switchMap, of } from 'rxjs';

interface ColaboradorData {
  email: string;
}

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
          const user = userCredential.user;
          return this.firestore.collection('colaborador').doc<ColaboradorData>(user.uid).get().pipe(
            switchMap(docSnapshot => {
              if (docSnapshot.exists) {
                return of({
                  uid: user.uid,
                  email: user.email
                });
              } else {
                return from(this.firestore.collection('colaborador').doc(user.uid).set({ email: user.email })).pipe(
                  switchMap(() => of({
                    uid: user.uid,
                    email: user.email
                  }))
                );
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
