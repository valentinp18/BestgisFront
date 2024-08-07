import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ColaboradorService } from './Colaborador.service';

interface Usuario {
  id?: string;
  email: string;
  colaborador_id: string;
  nombre_completo: string;
  estado: 'activo' | 'inactivo';
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private colaboradorService: ColaboradorService
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
      const colaborador = await this.colaboradorService.getColaborador(usuario.colaborador_id).toPromise();
      
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
}