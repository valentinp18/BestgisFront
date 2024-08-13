import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import { ColaboradorService } from './Colaborador.service';

interface Usuario {
  id?: string;
  email: string;
  colaborador_id: string;
  nombre_completo: string;
  estado: 'activo' | 'inactivo';
  uid?: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private colaboradorService: ColaboradorService,
    private storage: AngularFireStorage
  ) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>('usuarios').snapshotChanges().pipe(
      switchMap(actions => {
        const usuarios = actions.map(a => {
          const data = a.payload.doc.data() as Usuario;
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        const colaboradoresObservables = usuarios.map(usuario => 
          this.colaboradorService.getColaborador(usuario.colaborador_id)
        );

        return combineLatest([...colaboradoresObservables]).pipe(
          map(colaboradores => {
            return usuarios.map((usuario, index) => ({
              ...usuario,
              nombre_completo: `${colaboradores[index].nombre} ${colaboradores[index].apellido}`
            }));
          })
        );
      })
    );
  }

  async createUsuario(usuario: Usuario): Promise<any> {
    try {
      const tieneCuenta = await this.colaboradorTieneUsuario(usuario.colaborador_id);
      if (tieneCuenta) {
        throw new Error('Este colaborador ya tiene una cuenta de usuario');
      }
  
      const colaborador = await this.colaboradorService.getColaborador(usuario.colaborador_id).toPromise();
      
      if (!colaborador) {
        throw new Error('No se encontró el colaborador');
      }
  
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        colaborador.correo,
        this.generateTempPassword()
      );
  
      if (userCredential.user) {
        await this.firestore.collection('usuarios').add({
          email: colaborador.correo,
          colaborador_id: usuario.colaborador_id,
          nombre_completo: `${colaborador.nombre} ${colaborador.apellido}`,
          estado: usuario.estado,
          uid: userCredential.user.uid
        });
  
        await userCredential.user.sendEmailVerification();
        await this.afAuth.sendPasswordResetEmail(colaborador.correo);
  
        return userCredential.user.uid;
      } else {
        throw new Error('No se pudo crear el usuario en Firebase Auth');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  updateUsuario(id: string, usuario: Partial<Usuario>): Promise<void> {
    return this.firestore.collection('usuarios').doc(id).update(usuario);
  }

  async deleteUsuario(id: string): Promise<void> {
    const usuario = await this.firestore.collection('usuarios').doc(id).get().toPromise();
    const userData = usuario?.data() as Usuario;

    if (userData && userData.uid) {
      try {
        const user = await this.afAuth.currentUser;
        if (user) {
          await user.delete();
        }
      } catch (error) {
        console.error('Error al eliminar usuario de Firebase Auth:', error);
      }
    }

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

  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  getUsuarioByUid(uid: string): Observable<any> {
    return this.firestore.collection('usuarios', ref => ref.where('uid', '==', uid))
      .snapshotChanges().pipe(
        switchMap(actions => {
          if (actions.length > 0) {
            const usuario = actions[0].payload.doc.data() as Usuario;
            const id = actions[0].payload.doc.id;
            return this.colaboradorService.getColaborador(usuario.colaborador_id).pipe(
              map(colaborador => {
                return { id, ...usuario, ...colaborador };
              })
            );
          }
          return from([null]);
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

  async colaboradorTieneUsuario(colaboradorId: string): Promise<boolean> {
    const usuarios = await this.firestore.collection('usuarios', ref => 
      ref.where('colaborador_id', '==', colaboradorId)
    ).get().toPromise();
    
    return !usuarios?.empty;
  }

  async verificarEstadoUsuario(uid: string): Promise<boolean> {
    const usuario = await this.getUsuarioByUid(uid).toPromise();
    return usuario?.estado === 'activo';
  }
}