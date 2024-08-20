import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, throwError, of } from 'rxjs';
import { map, switchMap, finalize, catchError } from 'rxjs/operators';
import { ColaboradorService } from './Colaborador.service';
import firebase from 'firebase/compat/app';
import { environment } from '../../../../environments/environment';

export interface Usuario {
  id?: string;
  email: string;
  colaborador_id: string;
  nombre_completo: string;
  estado: 'activo' | 'inactivo';
  uid?: string;
  photoURL?: string | null;
  nombre?: string;
  apellido?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private secondaryApp: firebase.app.App;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private colaboradorService: ColaboradorService
  ) {this.secondaryApp = firebase.initializeApp(environment.firebase, 'secondary');}

  getUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>('usuarios').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createUsuario(usuario: { colaborador_id: string; estado?: 'activo' | 'inactivo' }): Observable<string> {
    if (!usuario.colaborador_id) {
      return throwError(() => new Error('El ID del colaborador es requerido'));
    }

    return this.colaboradorService.getColaborador(usuario.colaborador_id).pipe(
      switchMap(colaborador => {
        if (!colaborador) {
          return throwError(() => new Error('Colaborador no encontrado'));
        }

        return from(this.afAuth.fetchSignInMethodsForEmail(colaborador.correo)).pipe(
          switchMap(methods => {
            if (methods.length > 0) {
              return throwError(() => new Error('El correo electrónico ya está en uso'));
            }

            const tempPassword = this.generateTempPassword();

            return from(this.secondaryApp.auth().createUserWithEmailAndPassword(colaborador.correo, tempPassword)).pipe(
              switchMap(userCredential => {
                if (!userCredential.user) {
                  return throwError(() => new Error('No se pudo crear el usuario en Firebase Auth'));
                }

                const newUserId = userCredential.user.uid;

                const usuarioData: Usuario = {
                  email: colaborador.correo,
                  colaborador_id: usuario.colaborador_id,
                  nombre_completo: `${colaborador.nombre} ${colaborador.apellido}`,
                  estado: usuario.estado || 'activo',
                  uid: newUserId,
                  photoURL: null
                };

                return from(this.firestore.collection('usuarios').add(usuarioData)).pipe(
                  switchMap(() => from(userCredential.user!.sendEmailVerification())),
                  switchMap(() => from(this.afAuth.sendPasswordResetEmail(colaborador.correo))),
                  map(() => newUserId)
                );
              }),
              catchError(error => {
                console.error('Error al crear usuario:', error);
                return throwError(() => new Error(`Error al crear usuario: ${error.message}`));
              }),
              finalize(() => {
                // Cerrar sesión en la app secundaria
                return this.secondaryApp.auth().signOut();
              })
            );
          })
        );
      })
    );
  }

  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  updateUsuario(id: string, usuario: Partial<Usuario>): Promise<void> {
    return this.firestore.collection('usuarios').doc(id).update(usuario);
  }

  deleteUsuario(id: string): Promise<void> {
    return this.firestore.collection('usuarios').doc(id).delete();
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.firestore.collection('usuarios').doc<Usuario>(id).valueChanges().pipe(
      map(usuario => {
        if (usuario) {
          return usuario;
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
    );
  }

  uploadProfileImage(uid: string, image: File): Observable<string> {
    const filePath = `profile_images/${uid}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);

    return new Observable<string>(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            url => {
              this.updateUsuarioPhotoURL(uid, url)
                .then(() => {
                  observer.next(url);
                  observer.complete();
                })
                .catch(error => {
                  observer.error(error);
                });
            },
            error => observer.error(error)
          );
        })
      ).subscribe(
        null,
        error => observer.error(error)
      );
    });
  }

  private async updateUsuarioPhotoURL(uid: string, photoURL: string): Promise<void> {
    const querySnapshot = await this.firestore.collection('usuarios', ref => ref.where('uid', '==', uid)).get().toPromise();
    
    if (querySnapshot && !querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await this.firestore.collection('usuarios').doc(docId).update({ photoURL });
    } else {
      throw new Error('Usuario no encontrado');
    }
  }

  deleteProfileImage(uid: string): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection('usuarios', ref => ref.where('uid', '==', uid))
        .get()
        .toPromise()
        .then(querySnapshot => {
          if (querySnapshot && !querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            const userData = querySnapshot.docs[0].data() as Usuario;
            const filePath = `profile_images/${uid}`;
            const fileRef = this.storage.ref(filePath);
            this.firestore.collection('usuarios').doc(docId).update({ photoURL: null })
              .then(() => {
                if (userData.photoURL) {
                  return fileRef.delete().toPromise();
                }
                return Promise.resolve();
              })
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch(error => {
                observer.error(error);
              });
          } else {
            observer.error(new Error('Usuario no encontrado'));
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  getUsuarioByUid(uid: string): Observable<Usuario | null> {
    return this.firestore.collection('usuarios', ref => ref.where('uid', '==', uid))
      .snapshotChanges().pipe(
        map(actions => {
          if (actions.length > 0) {
            const userData = actions[0].payload.doc.data() as Usuario;
            const id = actions[0].payload.doc.id;
            return { id, ...userData };
          }
          return null;
        })
      );
  }

  getUserStatus(uid: string): Observable<'activo' | 'inactivo' | null> {
    return this.firestore.collection('usuarios', ref => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(
        map(users => {
          if (users.length > 0) {
            return (users[0] as Usuario).estado;
          }
          return null;
        })
      );
  }

  updateUserStatus(userId: string, newStatus: 'activo' | 'inactivo'): Promise<void> {
    return this.firestore.collection('usuarios').doc(userId).update({ estado: newStatus });
  }
}