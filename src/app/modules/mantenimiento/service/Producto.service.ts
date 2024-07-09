import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private firestore: AngularFirestore) {}

  getProductos(): Observable<any[]> {
    return this.firestore.collection('productos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { [key: string]: any };
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createProducto(producto: any): Promise<any> {
    return this.firestore.collection('productos').add(producto);
  }

  updateProducto(id: string, data: any): Promise<void> {
    return this.firestore.collection('productos').doc(id).update(data);
  }

  deleteProducto(id: string): Promise<void> {
    return this.firestore.collection('productos').doc(id).delete();
  }

  getProducto(id: string): Observable<any> {
    return this.firestore.collection('productos').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as { [key: string]: any };
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }
}
