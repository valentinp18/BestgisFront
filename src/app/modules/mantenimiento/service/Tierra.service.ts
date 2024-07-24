import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TierraService {
  constructor(private firestore: AngularFirestore) {}

  getTierras(): Observable<any[]> {
    return this.firestore.collection('tierras').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createTierra(tierra: any): Promise<any> {
    return this.firestore.collection('tierras').add(tierra);
  }

  updateTierra(id: string, data: any): Promise<void> {
    return this.firestore.collection('tierras').doc(id).update(data);
  }

  deleteTierra(id: string): Promise<void> {
    return this.firestore.collection('tierras').doc(id).delete();
  }

  getTierra(id: string): Observable<any> {
    return this.firestore.collection('tierras').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}