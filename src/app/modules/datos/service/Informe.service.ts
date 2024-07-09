import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface Informe {
  id?: string;
  nombre: string;
  observacion: string;
  url_evidencia: string;
  fecha_informe: string;
  clima_id: string;
  mision_id: string;
}

interface Clima {
  id?: string;
  nombre: string;
}

interface Mision {
  id?: string;
  fecha: string;
  razon: string;
}

@Injectable({
  providedIn: 'root'
})
export class InformeService {
  constructor(private firestore: AngularFirestore) {}

  getInformes(): Observable<any[]> {
    return this.firestore.collection<Informe>('informes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Informe;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      switchMap(informes => {
        if (informes.length === 0) return of([]);
        const observables = informes.map(informe =>
          forkJoin({
            clima: this.firestore.collection('climas').doc<Clima>(informe.clima_id).get(),
            mision: this.firestore.collection('misiones').doc<Mision>(informe.mision_id).get()
          }).pipe(
            map(({ clima, mision }) => ({
              ...informe,
              clima_nombre: clima.data()?.nombre,
              mision_info: mision.data()
            }))
          )
        );
        return forkJoin(observables);
      })
    );
  }

  createInforme(informe: Informe): Promise<any> {
    return this.firestore.collection('informes').add(informe);
  }

  updateInforme(id: string, informe: Partial<Informe>): Promise<void> {
    return this.firestore.collection('informes').doc(id).update(informe);
  }

  deleteInforme(id: string): Promise<void> {
    return this.firestore.collection('informes').doc(id).delete();
  }

  getInforme(id: string): Observable<any> {
    return this.firestore.collection('informes').doc<Informe>(id).valueChanges().pipe(
      switchMap((informe: Informe | undefined) => {
        if (!informe) throw new Error('No se encontró el informe');
        return forkJoin({
          informe: of(informe),
          clima: this.firestore.collection('climas').doc<Clima>(informe.clima_id).get(),
          mision: this.firestore.collection('misiones').doc<Mision>(informe.mision_id).get()
        });
      }),
      map(({ informe, clima, mision }) => ({
        ...informe,
        clima_nombre: clima.data()?.nombre,
        mision_info: mision.data()
      }))
    );
  }

  getClimas(): Observable<Clima[]> {
    return this.firestore.collection<Clima>('climas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Clima;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getMisiones(): Observable<Mision[]> {
    return this.firestore.collection<Mision>('misiones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Mision;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}