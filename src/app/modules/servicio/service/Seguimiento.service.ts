import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Seguimiento {
  id?: string;
  misionId: string;
  fechaSeguimiento: Date;
  estado: 'En progreso' | 'Finalizado';
  resultado?: 'Éxito' | 'Inconcluso' | 'Daño';
  observaciones: string;
  evidenciasAdicionales: string[];
  colaboradorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  constructor(private firestore: AngularFirestore) {}

  crearSeguimiento(seguimiento: Seguimiento): Promise<string> {
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
      }))
    );
  }

  actualizarSeguimiento(seguimiento: Seguimiento): Promise<void> {
    if (!seguimiento.id) {
      return Promise.reject(new Error('El seguimiento no tiene un ID válido'));
    }
    const { id, ...dataToUpdate } = seguimiento;
    return this.firestore.collection('seguimientos').doc(id).update(dataToUpdate);
  }

  eliminarSeguimiento(id: string): Promise<void> {
    return this.firestore.collection('seguimientos').doc(id).delete();
  }
}