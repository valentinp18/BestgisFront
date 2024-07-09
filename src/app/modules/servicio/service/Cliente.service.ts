import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface Cliente {
  id?: string;
  persona_id: string;
}

interface Persona {
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  telefono: string;
  direccion: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private firestore: AngularFirestore) {}

  getClientes(): Observable<any[]> {
    return this.firestore.collection<Cliente>('clientes').snapshotChanges().pipe(
      switchMap(actions => {
        const clientes = actions.map(a => {
          const data = a.payload.doc.data() as Cliente;
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        return from(Promise.all(clientes.map(async cliente => {
          const personaDoc = await this.firestore.collection('personas').doc(cliente.persona_id).get().toPromise();
          const personaData = personaDoc?.data() as Persona | undefined;
          return { ...cliente, ...personaData };
        })));
      })
    );
  }

  createCliente(cliente: Persona): Promise<any> {
    const personaData: Persona = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      tipo_documento: cliente.tipo_documento,
      numero_documento: cliente.numero_documento,
      sexo: cliente.sexo,
      fecha_nacimiento: cliente.fecha_nacimiento,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    };

    return this.firestore.collection('personas').add(personaData)
      .then(personaRef => {
        const clienteData: Cliente = {
          persona_id: personaRef.id
        };
        return this.firestore.collection('clientes').add(clienteData);
      });
  }

  updateCliente(id: string, cliente: Persona): Promise<void> {
    return this.firestore.collection('clientes').doc(id).get().toPromise()
      .then(doc => {
        if (!doc?.exists) {
          throw new Error('No se encontró el cliente');
        }
        const data = doc.data() as Cliente;
        const personaData: Persona = {
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          tipo_documento: cliente.tipo_documento,
          numero_documento: cliente.numero_documento,
          sexo: cliente.sexo,
          fecha_nacimiento: cliente.fecha_nacimiento,
          telefono: cliente.telefono,
          direccion: cliente.direccion
        };
        return this.firestore.collection('personas').doc(data.persona_id).update(personaData);
      });
  }

  deleteCliente(id: string): Promise<void> {
    return this.firestore.collection('clientes').doc(id).get().toPromise()
      .then(doc => {
        if (!doc?.exists) {
          throw new Error('No se encontró el cliente');
        }
        const data = doc.data() as Cliente;
        return this.firestore.collection('personas').doc(data.persona_id).delete();
      })
      .then(() => {
        return this.firestore.collection('clientes').doc(id).delete();
      });
  }

  getCliente(id: string): Observable<any> {
    return this.firestore.collection('clientes').doc<Cliente>(id).snapshotChanges().pipe(
      switchMap(action => {
        const data = action.payload.data() as Cliente | undefined;
        const id = action.payload.id;
        if (!data) {
          throw new Error('No se encontró el cliente');
        }
        return this.firestore.collection('personas').doc<Persona>(data.persona_id).get().pipe(
          map(personaDoc => {
            const personaData = personaDoc.data() as Persona | undefined;
            return { id, ...personaData };
          })
        );
      })
    );
  }
}