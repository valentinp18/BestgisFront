import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  constructor(private firestore: AngularFirestore) {}

  getRoles(): Observable<any[]> {
    return this.firestore.collection('roles').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createRol(rol: any): Promise<any> {
    return this.firestore.collection('roles').add(rol);
  }

  updateRol(id: string, data: any): Promise<void> {
    return this.firestore.collection('roles').doc(id).update(data);
  }

  deleteRol(id: string): Promise<void> {
    return this.firestore.collection('roles').doc(id).delete();
  }

  getRol(id: string): Observable<any> {
    return this.firestore.collection('roles').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
