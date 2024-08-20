import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';

interface Colaborador {
  id?: string;
  correo: string;
  persona_id: string;
  rol: string;
  [key: string]: any;
}

interface Persona {
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  telefono: string;
  direccion: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getColaboradores(): Observable<any[]> {
    return this.firestore.collection<Colaborador>('colaboradores').snapshotChanges().pipe(
      switchMap(actions => {
        const colaboradores = actions.map(a => {
          const data = a.payload.doc.data() as Colaborador;
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        return from(Promise.all(colaboradores.map(async colaborador => {
          const personaDoc = await this.firestore.collection('personas').doc(colaborador.persona_id).get().toPromise();
          const personaData = personaDoc?.data() as Persona | undefined;
          return { ...colaborador, ...personaData };
        })));
      })
    );
  }

  createColaborador(colaborador: Colaborador & Persona): Promise<any> {
    const personaData: Persona = {
      nombre: colaborador.nombre,
      apellido: colaborador.apellido,
      tipo_documento: colaborador.tipo_documento,
      numero_documento: colaborador.numero_documento,
      sexo: colaborador.sexo,
      fecha_nacimiento: colaborador.fecha_nacimiento,
      telefono: colaborador.telefono,
      direccion: colaborador.direccion
    };

    return this.firestore.collection('personas').add(personaData)
      .then(personaRef => {
        const colaboradorData: Colaborador = {
          correo: colaborador.correo,
          persona_id: personaRef.id,
          rol: colaborador.rol 
        };
        return this.firestore.collection('colaboradores').add(colaboradorData);
      });
  }

  updateColaborador(id: string, colaborador: Colaborador & Persona): Promise<void> {
    return this.firestore.collection('colaboradores').doc(id).get().toPromise()
      .then(doc => {
        if (!doc?.exists) {
          throw new Error('No se encontró el colaborador');
        }
        const data = doc.data() as Colaborador;
        const personaData: Persona = {
          nombre: colaborador.nombre,
          apellido: colaborador.apellido,
          tipo_documento: colaborador.tipo_documento,
          numero_documento: colaborador.numero_documento,
          sexo: colaborador.sexo,
          fecha_nacimiento: colaborador.fecha_nacimiento,
          telefono: colaborador.telefono,
          direccion: colaborador.direccion
        };
        return this.firestore.collection('personas').doc(data.persona_id).update(personaData);
      })
      .then(() => {
        return this.firestore.collection('colaboradores').doc(id).update({
          correo: colaborador.correo,
          rol: colaborador.rol
        });
      });
  }

  deleteColaborador(id: string): Promise<void> {
    return this.firestore.collection('colaboradores').doc(id).get().toPromise()
      .then(doc => {
        if (!doc?.exists) {
          throw new Error('No se encontró el colaborador');
        }
        const data = doc.data() as Colaborador;
        return this.firestore.collection('personas').doc(data.persona_id).delete();
      })
      .then(() => {
        return this.firestore.collection('colaboradores').doc(id).delete();
      });
  }

  getColaborador(id: string): Observable<any> {
    return this.firestore.collection('colaboradores').doc<Colaborador>(id).snapshotChanges().pipe(
      switchMap(action => {
        const data = action.payload.data() as Colaborador | undefined;
        const id = action.payload.id;
        if (!data) {
          throw new Error('No se encontró el colaborador');
        }
        return this.firestore.collection('personas').doc<Persona>(data.persona_id).get().pipe(
          map(personaDoc => {
            const personaData = personaDoc.data() as Persona | undefined;
            return { 
              id, 
              correo: data.correo, 
              rol: data.rol, 
              ...personaData 
            };
          })
        );
      })
    );
  }
}