import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DroneService {
  constructor(private firestore: AngularFirestore) {}

  getDrones(): Observable<any[]> {
    return this.firestore.collection('drones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createDrone(drone: any): Promise<any> {
    return this.firestore.collection('drones').add(drone);
  }

  updateDrone(id: string, data: any): Promise<void> {
    return this.firestore.collection('drones').doc(id).update(data);
  }

  deleteDrone(id: string): Promise<void> {
    return this.firestore.collection('drones').doc(id).delete();
  }

  getDrone(id: string): Observable<any> {
    return this.firestore.collection('drones').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
