import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, forkJoin, of, from } from 'rxjs';
import { map, switchMap, last } from 'rxjs/operators';
import firebase from 'firebase/compat/app'; 

export interface Seguimiento {
  id?: string;
  misionId: string;
  ultimo_id: number;
  fechaSeguimiento: string;
  fechaFinal?: string;
  estado: 'En progreso' | 'Finalizado';
  resultado?: 'Éxito' | 'Inconcluso' | 'Daño';
  observaciones: string;
  evidenciasAdicionales: string[]; 
  colaboradorId: string;
  colaboradorNombre?: string; 
}

interface Evidencia {
  tipo: 'imagen' | 'video';
  url: string;
}

interface Colaborador {
  id?: string;
  persona_id: string;
}

interface Persona {
  nombre: string;
  apellido: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage) {}

  crearSeguimiento(seguimiento: Seguimiento): Promise<string> {
    if (typeof seguimiento.ultimo_id !== 'number') {
      return Promise.reject(new Error('ultimo_id debe ser un número válido'));
    }
    return this.firestore.collection('seguimientos').add(seguimiento)
      .then(docRef => docRef.id);
  }

  getSeguimientos(misionId: string): Observable<Seguimiento[]> {
    return this.firestore.collection<Seguimiento>('seguimientos', ref =>
      ref.where('misionId', '==', misionId).orderBy('fechaSeguimiento', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Seguimiento;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      switchMap(seguimientos => {
        const colaboradoresObservables = seguimientos.map(seg => 
          this.getColaboradorNombre(seg.colaboradorId).pipe(
            map(nombre => ({ ...seg, colaboradorNombre: nombre }))
          )
        );
        return forkJoin(colaboradoresObservables);
      })
    );
  }

  getAllSeguimientos(): Observable<Seguimiento[]> {
    return this.firestore.collection<Seguimiento>('seguimientos', ref =>
      ref.orderBy('fechaSeguimiento', 'desc')
    ).snapshotChanges().pipe(
      switchMap(actions => {
        const seguimientos = actions.map(a => {
          const data = a.payload.doc.data() as Seguimiento;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        
        const colaboradoresObservables = seguimientos.map(seg => 
          this.getColaboradorNombre(seg.colaboradorId).pipe(
            map(nombre => ({ ...seg, colaboradorNombre: nombre }))
          )
        );
        
        return forkJoin(colaboradoresObservables);
      })
    );
  }

  getSeguimiento(id: string): Observable<Seguimiento | null> {
    return this.firestore.doc<Seguimiento>(`seguimientos/${id}`).snapshotChanges().pipe(
      switchMap(action => {
        const data = action.payload.data() as Seguimiento;
        const id = action.payload.id;
        if (!data) return of(null);
        
        return this.getColaboradorNombre(data.colaboradorId).pipe(
          map(nombre => ({ id, ...data, colaboradorNombre: nombre }))
        );
      })
    );
  }

  actualizarSeguimiento(seguimiento: Seguimiento): Promise<void> {
    if (!seguimiento.id) {
      return Promise.reject(new Error('El seguimiento no tiene un ID válido'));
    }
    const { id, ...dataToUpdate } = seguimiento;
  
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key as keyof typeof dataToUpdate] === undefined) {
        delete dataToUpdate[key as keyof typeof dataToUpdate];
      }
    });
  
    if (!dataToUpdate.evidenciasAdicionales) {
      dataToUpdate.evidenciasAdicionales = [];
    }
  
    return this.firestore.collection('seguimientos').doc(id).update(dataToUpdate);
  }

  eliminarSeguimiento(id: string): Promise<void> {
    return this.firestore.collection('seguimientos').doc(id).delete();
  }

  eliminarSeguimientosPorMision(misionId: string): Promise<void> {
    return this.firestore.collection('seguimientos', ref => ref.where('misionId', '==', misionId))
      .get()
      .toPromise()
      .then(querySnapshot => {
        if (querySnapshot) {
          const batch = this.firestore.firestore.batch();
          querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        }
        return Promise.resolve();
      });
  }

  private getColaboradorNombre(colaboradorId: string): Observable<string> {
    return this.firestore.doc<Colaborador>(`colaboradores/${colaboradorId}`).get().pipe(
      switchMap(colaboradorDoc => {
        const colaborador = colaboradorDoc.data();
        if (!colaborador) return of('Colaborador no encontrado');
        
        return this.firestore.doc<Persona>(`personas/${colaborador.persona_id}`).get().pipe(
          map(personaDoc => {
            const persona = personaDoc.data();
            if (!persona) return 'Persona no encontrada';
            return `${persona.nombre} ${persona.apellido}`;
          })
        );
      })
    );
  }

  getMisionFecha(misionId: string): Observable<string> {
    return this.firestore.doc(`misiones/${misionId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.fecha : '';
      })
    );
  }

  getColaboradores(): Observable<any[]> {
    return this.firestore.collection('colaboradores').snapshotChanges().pipe(
      switchMap(actions => {
        const colaboradores = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        
        const personasObservables = colaboradores.map(col => 
          this.firestore.doc(`personas/${col.persona_id}`).get().pipe(
            map(personaDoc => {
              const persona = personaDoc.data() as any;
              return {
                ...col,
                nombre: persona ? persona.nombre : '',
                apellido: persona ? persona.apellido : ''
              };
            })
          )
        );     
        return forkJoin(personasObservables);
      })
    );
  }

  uploadEvidencia(seguimientoId: string, file: File, tipo: 'imagen' | 'video'): Observable<Evidencia> {
    const filePath = `seguimientos/${seguimientoId}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
      map(url => {
        const cleanUrl = url.replace(/&token=[^&]+/, '');
        const evidencia: Evidencia = { tipo, url: cleanUrl };
        return evidencia;
      }),
      switchMap(evidencia => 
        this.firestore.doc(`seguimientos/${seguimientoId}`).update({
          evidenciasAdicionales: firebase.firestore.FieldValue.arrayUnion(evidencia.url)
        }).then(() => evidencia)
      )
    );
  }

  removeEvidencia(seguimientoId: string, evidencia: { url: string }): Observable<void> {
    return from(this.storage.refFromURL(evidencia.url).delete()).pipe(
      switchMap(() => {
        return this.firestore.doc(`seguimientos/${seguimientoId}`).get().pipe(
          switchMap(doc => {
            const seguimiento = doc.data() as Seguimiento;
            const updatedEvidencias = seguimiento.evidenciasAdicionales.filter(e => e !== evidencia.url);
            return from(doc.ref.update({ evidenciasAdicionales: updatedEvidencias }));
          })
        );
      })
    );
  }

  observeMisionFecha(misionId: string): Observable<string> {
    return this.firestore.doc(`misiones/${misionId}`).valueChanges()
      .pipe(
        map((mision: any) => mision?.fecha || '')
      );
  }

  actualizarFechaSeguimiento(seguimientoId: string, nuevaFecha: string): Promise<void> {
    return this.firestore.doc(`seguimientos/${seguimientoId}`).update({ fechaSeguimiento: nuevaFecha });
  }

  getSeguimientosByUltimoId(ultimoId: string): Observable<Seguimiento[]> {
    return this.firestore.collection<Seguimiento>('seguimientos', ref => 
      ref.where('ultimo_id', '==', parseInt(ultimoId))
    ).valueChanges({ idField: 'id' });
  }

  getSeguimientosPorMision(misionId: string): Observable<Seguimiento[]> {
    return this.firestore.collection('seguimientos', ref => ref.where('misionId', '==', misionId))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Seguimiento;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

}