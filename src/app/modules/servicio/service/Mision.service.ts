import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, forkJoin, of, from, take } from 'rxjs';
import { map, switchMap, catchError,last  } from 'rxjs/operators';
import firebase from 'firebase/compat/app'; 
import { SeguimientoService, Seguimiento  } from './Seguimiento.service';

interface Mision {
  id?: string;
  ultimo_id: number;
  fecha: string;
  razon: string;
  observacion: string;
  cultivo_id: string;
  etapa_cultivo: string;
  ubicacion_id: string;
  producto_id: string;
  drone_id: string;
  colaborador_id: string;
  cliente_id: string;
  tierra_id: string;
  clima_id: string;
  evidencias?: Evidencia[];
}

interface Cultivo {
  id?: string;
  nombre: string;
  tipo: string;
  etapas: string[];
  descripcion: string;
}

interface Ubicacion {
  departamento: string;
  provincia: string;
  distrito: string;
  centro_poblado?: string;
  gps?: string;
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

interface Cliente {
  id?: string;
  persona_id: string;
}

interface Tierra {
  nombre: string;
}

interface Clima {
  nombre: string;
}

interface Evidencia {
  tipo: 'imagen' | 'video';
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class MisionService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private seguimientoService: SeguimientoService
  ) {}
  
  getMisiones(): Observable<any[]> {
    return this.firestore.collection<Mision>('misiones', ref => ref.orderBy('ultimo_id', 'desc')).snapshotChanges().pipe(
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
            ubicacion: this.firestore.collection('ubicaciones').doc<Ubicacion>(mision.ubicacion_id).get(),
            producto: this.firestore.collection('productos').doc<Producto>(mision.producto_id).get(),
            drone: this.firestore.collection('drones').doc<Drone>(mision.drone_id).get(),
            colaborador: this.firestore.collection('colaboradores').doc<Colaborador>(mision.colaborador_id).get(),
            cliente: this.firestore.collection('clientes').doc<Cliente>(mision.cliente_id).get(),
            tierra: this.firestore.collection('tierras').doc<Tierra>(mision.tierra_id).get(),
            clima: this.firestore.collection('climas').doc<Clima>(mision.clima_id).get()
          }).pipe(
            switchMap(({ cultivo, ubicacion, producto, drone, colaborador, cliente, tierra, clima }) => {
              const colaboradorData = colaborador.data();
              const clienteData = cliente.data();
              return forkJoin({
                colaboradorPersona: colaboradorData && colaboradorData.persona_id ?
                  this.firestore.collection('personas').doc<Persona>(colaboradorData.persona_id).get() : of(null),
                clientePersona: clienteData && clienteData.persona_id ?
                  this.firestore.collection('personas').doc<Persona>(clienteData.persona_id).get() : of(null)
              }).pipe(
                map(({ colaboradorPersona, clientePersona }) => ({
                  ...mision,
                  cultivo_nombre: cultivo.data()?.nombre,
                  cultivo_etapas: cultivo.data()?.etapas,
                  ubicacion_info: ubicacion.data() ? {
                    departamento: ubicacion.data()?.departamento || '',
                    provincia: ubicacion.data()?.provincia || '',
                    distrito: ubicacion.data()?.distrito || '',
                    centro_poblado: ubicacion.data()?.centro_poblado,
                    gps: ubicacion.data()?.gps
                  } : null,
                  producto_info: producto.data(),
                  drone_info: drone.data(),
                  colaborador_info: {
                    ...(colaboradorPersona ? colaboradorPersona.data() : {}),
                    correo: colaboradorData?.correo
                  },
                  cliente_info: clientePersona ? clientePersona.data() : {},
                  tierra_nombre: tierra.data()?.nombre,
                  clima_nombre: clima.data()?.nombre
                }))
              );
            })
          )
        );
        return forkJoin(observables);
      })
    );
  }

  private getNextMisionId(): Observable<number> {
    return this.firestore.collection<Mision>('misiones', ref => ref.orderBy('ultimo_id', 'desc').limit(1))
      .valueChanges()
      .pipe(
        take(1),
        map(misiones => {
          if (misiones.length > 0 && misiones[0].ultimo_id !== undefined) {
            return misiones[0].ultimo_id + 1;
          } else {
            return 1;
          }
        })
      );
  }

  createMision(mision: Omit<Mision, 'id' | 'ultimo_id'>): Observable<string> {
    return this.getNextMisionId().pipe(
      switchMap(ultimoId => {
        const newMision: Mision = {
          ...mision,
          ultimo_id: ultimoId,
        };
        return from(this.firestore.collection('misiones').add(newMision)).pipe(
          map(docRef => docRef.id)
        );
      })
    );
  }

  updateMision(id: string, mision: Partial<Mision>): Observable<void> {
    return from(this.firestore.collection('misiones').doc(id).update(mision));
  }

  deleteMision(id: string): Observable<void> {
    return this.firestore.collection('misiones').doc(id).get().pipe(
      switchMap(doc => {
        if (doc.exists) {
          const mision = doc.data() as Mision;
          const evidencias = mision.evidencias || [];

          const deleteEvidencias$ = evidencias.map(evidencia => 
            this.storage.refFromURL(evidencia.url).delete()
          );
 
          return forkJoin([
            ...deleteEvidencias$,
            this.firestore.collection('misiones').doc(id).delete()
          ]);
        } else {
          return of(null);
        }
      }),
      map(() => undefined),
      catchError(error => {
        console.error('Error al eliminar la misión:', error);
        throw error; 
      })
    );
  }

  getMision(id: string): Observable<any> {
    return this.firestore.collection('misiones').doc<Mision>(id).valueChanges().pipe(
      switchMap((mision: Mision | undefined) => {
        if (!mision) throw new Error('No se encontró la misión');
        return forkJoin({
          mision: of(mision),
          cultivo: this.firestore.collection('cultivos').doc<Cultivo>(mision.cultivo_id).get(),
          ubicacion: this.firestore.collection('ubicaciones').doc<Ubicacion>(mision.ubicacion_id).get(),
          producto: this.firestore.collection('productos').doc<Producto>(mision.producto_id).get(),
          drone: this.firestore.collection('drones').doc<Drone>(mision.drone_id).get(),
          colaborador: this.firestore.collection('colaboradores').doc<Colaborador>(mision.colaborador_id).get(),
          tierra: this.firestore.collection('tierras').doc<Tierra>(mision.tierra_id).get(),
          clima: this.firestore.collection('climas').doc<Clima>(mision.clima_id).get()
        });
      }),
      map(({ mision, cultivo, ubicacion, producto, drone, colaborador, tierra, clima }) => ({
        ...mision,
        cultivo_nombre: cultivo.data()?.nombre,
        cultivo_etapas: cultivo.data()?.etapas,
        ubicacion_info: ubicacion.data() ? {
          departamento: ubicacion.data()?.departamento || '',
          provincia: ubicacion.data()?.provincia || '',
          distrito: ubicacion.data()?.distrito || '',
          centro_poblado: ubicacion.data()?.centro_poblado,
          gps: ubicacion.data()?.gps
        } : null,
        producto_info: producto.data(),
        drone_info: drone.data(),
        colaborador_info: colaborador.data(),
        tierra_nombre: tierra.data()?.nombre,
        clima_nombre: clima.data()?.nombre
      }))
    );
  }

  getCultivos(): Observable<Cultivo[]> {
    return this.firestore.collection<Cultivo>('cultivos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cultivo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.firestore.collection<Ubicacion>('ubicaciones').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ubicacion;
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

  getClientes(): Observable<Cliente[]> {
    return this.firestore.collection<Cliente>('clientes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getTierras(): Observable<Tierra[]> {
    return this.firestore.collection<Tierra>('tierras').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getClimas(): Observable<Clima[]> {
    return this.firestore.collection<Clima>('climas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  uploadEvidencia(misionId: string, file: File, tipo: 'imagen' | 'video'): Observable<Evidencia> {
    const filePath = `misiones/${misionId}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
      map(url => {
        const cleanUrl = url.replace(/&token=[^&]+/, '');
        const evidencia: Evidencia = { tipo, url: cleanUrl };
        return evidencia;
      }),
      switchMap(evidencia => 
        this.firestore.collection('misiones').doc(misionId).update({
          evidencias: firebase.firestore.FieldValue.arrayUnion(evidencia)
        }).then(() => evidencia)
      )
    );
  }

  removeEvidencia(misionId: string, evidencia: Evidencia): Observable<void> {
    return from(this.firestore.collection('misiones').doc(misionId).update({
      evidencias: firebase.firestore.FieldValue.arrayRemove(evidencia)
    })).pipe(
      switchMap(() => {
        const fileRef = this.storage.refFromURL(evidencia.url);
        return from(fileRef.delete());
      })
    );
  }

  createMisionWithTracking(mision: Omit<Mision, 'id' | 'ultimo_id'>): Observable<string> {
    return this.getNextMisionId().pipe(
      switchMap(ultimoId => {
        const newMision: Mision = {
          ...mision,
          ultimo_id: ultimoId,
        };
        return from(this.firestore.collection('misiones').add(newMision)).pipe(
          switchMap(docRef => {
            const seguimiento: Seguimiento = {
              misionId: docRef.id,
              fechaSeguimiento: new Date(),
              estado: 'En progreso',
              observaciones: '',
              evidenciasAdicionales: [],
              colaboradorId: mision.colaborador_id
            };
            return from(this.seguimientoService.crearSeguimiento(seguimiento)).pipe(
              map(() => docRef.id)
            );
          })
        );
      })
    );
  }


  getSeguimientosMision(misionId: string): Observable<Seguimiento[]> {
    return this.seguimientoService.getSeguimientos(misionId);
  }

  actualizarSeguimientoMision(seguimiento: Seguimiento): Observable<void> {
    return from(this.seguimientoService.actualizarSeguimiento(seguimiento));
  }

}