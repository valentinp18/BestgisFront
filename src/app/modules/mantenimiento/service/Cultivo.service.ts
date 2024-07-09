import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CultivoService {
  constructor(private firestore: AngularFirestore) {}

  getCultivos(): Observable<any[]> {
    return this.firestore.collection('cultivos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createCultivo(cultivo: any): Promise<any> {
    return this.firestore.collection('cultivos').add(cultivo);
  }

  updateCultivo(id: string, data: any): Promise<void> {
    return this.firestore.collection('cultivos').doc(id).update(data);
  }

  deleteCultivo(id: string): Promise<void> {
    return this.firestore.collection('cultivos').doc(id).delete();
  }

  getCultivo(id: string): Observable<any> {
    return this.firestore.collection('cultivos').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
