import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  constructor(private firestore: AngularFirestore) {}

  getUbicaciones(): Observable<any[]> {
    return this.firestore.collection('ubicaciones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createUbicacion(ubicacion: any): Promise<any> {
    return this.firestore.collection('ubicaciones').add(ubicacion);
  }

  updateUbicacion(id: string, data: any): Promise<void> {
    return this.firestore.collection('ubicaciones').doc(id).update(data);
  }

  deleteUbicacion(id: string): Promise<void> {
    return this.firestore.collection('ubicaciones').doc(id).delete();
  }

  getUbicacion(id: string): Observable<any> {
    return this.firestore.collection('ubicaciones').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
