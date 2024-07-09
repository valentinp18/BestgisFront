import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CampoAgricolaService {
  constructor(private firestore: AngularFirestore) {}

  getCamposAgricolas(): Observable<any[]> {
    return this.firestore.collection('campos_agricolas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createCampoAgricola(campoAgricola: any): Promise<any> {
    return this.firestore.collection('campos_agricolas').add(campoAgricola);
  }

  updateCampoAgricola(id: string, data: any): Promise<void> {
    return this.firestore.collection('campos_agricolas').doc(id).update(data);
  }

  deleteCampoAgricola(id: string): Promise<void> {
    return this.firestore.collection('campos_agricolas').doc(id).delete();
  }

  getCampoAgricola(id: string): Observable<any> {
    return this.firestore.collection('campos_agricolas').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }

  getUbicaciones(): Observable<any[]> {
    return this.firestore.collection('ubicaciones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}