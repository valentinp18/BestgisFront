import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface Mision {
  id?: string;
  fecha: string;
  razon: string;
  observacion: string;
  cultivo_id: string;
  campo_agricola_id: string;
  producto_id: string;
  drone_id: string;
  colaborador_id: string;
}

interface Cultivo {
  nombre: string;
}

interface CampoAgricola {
  departamento: string;
  provincia: string;
  distrito: string;
  centro_poblado: string;
  tipo_tierra: string;
}

interface Producto {
  nombre: string;
  tipo: string;
}

interface Drone {
  modelo: string;
  tipo: string;
}

interface Colaborador {
  correo: string;
  persona_id: string;
}

interface Persona {
  apellido: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class MisionService {
  constructor(private firestore: AngularFirestore) {}

  getMisiones(): Observable<any[]> {
    return this.firestore.collection<Mision>('misiones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Mision;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      switchMap(misiones => {
        if (misiones.length === 0) return of([]);
        const observables = misiones.map(mision =>
          forkJoin({
            cultivo: this.firestore.collection('cultivos').doc<Cultivo>(mision.cultivo_id).get(),
            campo_agricola: this.firestore.collection('campos_agricolas').doc<CampoAgricola>(mision.campo_agricola_id).get(),
            producto: this.firestore.collection('productos').doc<Producto>(mision.producto_id).get(),
            drone: this.firestore.collection('drones').doc<Drone>(mision.drone_id).get(),
            colaborador: this.firestore.collection('colaboradores').doc<Colaborador>(mision.colaborador_id).get()
          }).pipe(
            switchMap(({ cultivo, campo_agricola, producto, drone, colaborador }) => {
              const colaboradorData = colaborador.data();
              if (colaboradorData && colaboradorData.persona_id) {
                return this.firestore.collection('personas').doc<Persona>(colaboradorData.persona_id).get().pipe(
                  map(persona => ({
                    ...mision,
                    cultivo_nombre: cultivo.data()?.nombre,
                    campo_agricola_info: campo_agricola.data(),
                    producto_info: producto.data(),
                    drone_info: drone.data(),
                    colaborador_info: {
                      correo: colaboradorData.correo,
                      ...persona.data()
                    }
                  }))
                );
              } else {
                return of({
                  ...mision,
                  cultivo_nombre: cultivo.data()?.nombre,
                  campo_agricola_info: campo_agricola.data(),
                  producto_info: producto.data(),
                  drone_info: drone.data(),
                  colaborador_info: colaboradorData
                });
              }
            })
          )
        );
        return forkJoin(observables);
      })
    );
  }

  createMision(mision: Mision): Promise<any> {
    return this.firestore.collection('misiones').add(mision);
  }

  updateMision(id: string, mision: Partial<Mision>): Promise<void> {
    return this.firestore.collection('misiones').doc(id).update(mision);
  }

  deleteMision(id: string): Promise<void> {
    return this.firestore.collection('misiones').doc(id).delete();
  }

  getMision(id: string): Observable<any> {
    return this.firestore.collection('misiones').doc<Mision>(id).valueChanges().pipe(
      switchMap((mision: Mision | undefined) => {
        if (!mision) throw new Error('No se encontró la misión');
        return forkJoin({
          mision: Promise.resolve(mision),
          cultivo: this.firestore.collection('cultivos').doc<Cultivo>(mision.cultivo_id).get().toPromise(),
          campo_agricola: this.firestore.collection('campos_agricolas').doc<CampoAgricola>(mision.campo_agricola_id).get().toPromise(),
          producto: this.firestore.collection('productos').doc<Producto>(mision.producto_id).get().toPromise(),
          drone: this.firestore.collection('drones').doc<Drone>(mision.drone_id).get().toPromise(),
          colaborador: this.firestore.collection('colaboradores').doc<Colaborador>(mision.colaborador_id).get().toPromise()
        });
      }),
      map(({ mision, cultivo, campo_agricola, producto, drone, colaborador }) => ({
        ...mision,
        cultivo_nombre: cultivo?.data()?.nombre,
        campo_agricola_info: campo_agricola?.data(),
        producto_info: producto?.data(),
        drone_info: drone?.data(),
        colaborador_info: colaborador?.data()
      }))
    );
  }

  getCultivos(): Observable<Cultivo[]> {
    return this.firestore.collection<Cultivo>('cultivos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getCamposAgricolas(): Observable<CampoAgricola[]> {
    return this.firestore.collection<CampoAgricola>('campos_agricolas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProductos(): Observable<Producto[]> {
    return this.firestore.collection<Producto>('productos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getDrones(): Observable<Drone[]> {
    return this.firestore.collection<Drone>('drones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getColaboradores(): Observable<Colaborador[]> {
    return this.firestore.collection<Colaborador>('colaboradores').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getPersona(id: string): Observable<Persona> {
    return this.firestore.collection('personas').doc<Persona>(id).valueChanges().pipe(
      map(persona => {
        if (persona) {
          return persona;
        } else {
          return {
            apellido: 'No disponible',
            nombre: 'No disponible'
          };
        }
      })
    );
  }
}