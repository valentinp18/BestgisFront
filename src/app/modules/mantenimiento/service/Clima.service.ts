import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  constructor(private firestore: AngularFirestore) {}

  getClimas(): Observable<any[]> {
    return this.firestore.collection('climas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createClima(clima: any): Promise<any> {
    return this.firestore.collection('climas').add(clima);
  }

  updateClima(id: string, data: any): Promise<void> {
    return this.firestore.collection('climas').doc(id).update(data);
  }

  deleteClima(id: string): Promise<void> {
    return this.firestore.collection('climas').doc(id).delete();
  }

  getClima(id: string): Observable<any> {
    return this.firestore.collection('climas').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}