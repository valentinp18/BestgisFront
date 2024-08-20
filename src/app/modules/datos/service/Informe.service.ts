import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface Informe {
  id?: string;
  misionId: string;
  ultimo_id: number;
  fechaSeguimiento: string;
  fechaFinal?: string;
  estado: 'En progreso' | 'Finalizado';
  resultado?: 'Éxito' | 'Inconcluso' | 'Daño';
  observaciones: string;
  evidenciasAdicionales: string[];
  colaboradorId: string;
  colaboradorNombre?: string;
  cliente: string;
  cultivo: string;
  etapaCultivo: string;
  razon: string;
  ubicacion: string;
  tierra: string;
  clima: string;
  producto: string;
  drone: string;
  observacionMision: string;
  colaboradorMision: string;
}

@Injectable({
  providedIn: 'root'
})
export class InformeService {
  constructor(private firestore: AngularFirestore) {}

  getAllInformes(): Observable<Informe[]> {
    return this.firestore.collection<Informe>('seguimientos', ref =>
      ref.orderBy('fechaSeguimiento', 'desc')
    ).snapshotChanges().pipe(
      switchMap(actions => {
        const informes = actions.map(a => {
          const data = a.payload.doc.data() as Informe;
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        const informesObservables = informes.map(informe =>
          this.getMisionData(informe.misionId).pipe(
            map(misionData => ({ ...informe, ...misionData }))
          )
        );

        return forkJoin(informesObservables);
      })
    );
  }

  private getMisionData(misionId: string): Observable<any> {
    return this.firestore.doc(`misiones/${misionId}`).get().pipe(
      switchMap(misionDoc => {
        const misionData = misionDoc.data() as any;
        if (!misionData) {
          return of({});
        }

        return forkJoin({
          cliente: this.getClienteData(misionData.cliente_id),
          cultivo: this.getCultivoData(misionData.cultivo_id),
          ubicacion: this.getUbicacionData(misionData.ubicacion_id),
          producto: this.getProductoData(misionData.producto_id),
          drone: this.getDroneData(misionData.drone_id),
          colaborador: this.getColaboradorData(misionData.colaborador_id),
          tierra: this.getTierraData(misionData.tierra_id),
          clima: this.getClimaData(misionData.clima_id)
        }).pipe(
          map(relatedData => ({
            razon: misionData.razon,
            observacionMision: misionData.observacion,
            etapaCultivo: misionData.etapa_cultivo,
            ...relatedData
          }))
        );
      }),
      catchError(() => of({}))
    );
  }

  private getClienteData(clienteId: string): Observable<string> {
    return this.firestore.doc(`clientes/${clienteId}`).get().pipe(
      switchMap(clienteDoc => {
        const clienteData = clienteDoc.data() as any;
        if (!clienteData) return of('No especificado');
        return this.firestore.doc(`personas/${clienteData.persona_id}`).get().pipe(
          map(personaDoc => {
            const personaData = personaDoc.data() as any;
            return personaData ? `${personaData.nombre} ${personaData.apellido}` : 'No especificado';
          })
        );
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getCultivoData(cultivoId: string): Observable<string> {
    return this.firestore.doc(`cultivos/${cultivoId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.nombre : 'No especificado';
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getUbicacionData(ubicacionId: string): Observable<string> {
    return this.firestore.doc(`ubicaciones/${ubicacionId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? `${data.departamento}, ${data.provincia}, ${data.distrito}` : 'No especificada';
      }),
      catchError(() => of('No especificada'))
    );
  }

  private getProductoData(productoId: string): Observable<string> {
    return this.firestore.doc(`productos/${productoId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.nombre : 'No especificado';
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getDroneData(droneId: string): Observable<string> {
    return this.firestore.doc(`drones/${droneId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.modelo : 'No especificado';
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getColaboradorData(colaboradorId: string): Observable<string> {
    return this.firestore.doc(`colaboradores/${colaboradorId}`).get().pipe(
      switchMap(colaboradorDoc => {
        const colaboradorData = colaboradorDoc.data() as any;
        if (!colaboradorData) return of('No especificado');
        return this.firestore.doc(`personas/${colaboradorData.persona_id}`).get().pipe(
          map(personaDoc => {
            const personaData = personaDoc.data() as any;
            return personaData ? `${personaData.nombre} ${personaData.apellido}` : 'No especificado';
          })
        );
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getTierraData(tierraId: string): Observable<string> {
    return this.firestore.doc(`tierras/${tierraId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.nombre : 'No especificado';
      }),
      catchError(() => of('No especificado'))
    );
  }

  private getClimaData(climaId: string): Observable<string> {
    return this.firestore.doc(`climas/${climaId}`).get().pipe(
      map(doc => {
        const data = doc.data() as any;
        return data ? data.nombre : 'No especificado';
      }),
      catchError(() => of('No especificado'))
    );
  }

  getInformesByUltimoId(ultimoId: string): Observable<Informe[]> {
    return this.firestore.collection<Informe>('seguimientos', ref =>
       ref.where('ultimo_id', '==', parseInt(ultimoId))
    ).valueChanges({ idField: 'id' });
  }
 
  
//DASBOARD
getEstadisticas(): Observable<any> {
  return this.getAllInformes().pipe(
    map(informes => {
      const total = informes.length;
      const enProgreso = informes.filter(i => i.estado === 'En progreso').length;
      const finalizados = informes.filter(i => i.estado === 'Finalizado').length;
      const exito = informes.filter(i => i.resultado === 'Éxito').length;
      const inconcluso = informes.filter(i => i.resultado === 'Inconcluso').length;
      const daño = informes.filter(i => i.resultado === 'Daño').length;

      const cultivosPorFrecuencia = this.contarFrecuencia(informes, 'cultivo');
      const ubicacionesPorFrecuencia = this.contarFrecuencia(informes, 'ubicacion');
      const clientesPorFrecuencia = this.contarFrecuencia(informes, 'cliente');
      const productosPorFrecuencia = this.contarFrecuencia(informes, 'producto');
      const dronesPorFrecuencia = this.contarFrecuencia(informes, 'drone');
      const colaboradoresPorFrecuencia = this.contarFrecuencia(informes, 'colaboradorNombre');
      const tierrasPorFrecuencia = this.contarFrecuencia(informes, 'tierra');
      const climasPorFrecuencia = this.contarFrecuencia(informes, 'clima');
      const razonesPorFrecuencia = this.contarFrecuencia(informes, 'razon');
      const etapasPorFrecuencia = this.contarFrecuencia(informes, 'etapaCultivo');

      const tendenciaTemporal = this.analizarTendenciaTemporal(informes);
      const efectividadProductos = this.analizarEfectividadProductos(informes);
      const rendimientoDrones = this.analizarRendimientoDrones(informes);
      const efectividadColaboradores = this.analizarEfectividadColaboradores(informes);
      const impactoClimatico = this.analizarImpactoClimatico(informes);

      return {
        total,
        enProgreso,
        finalizados,
        exito,
        inconcluso,
        daño,
        cultivosPorFrecuencia,
        ubicacionesPorFrecuencia,
        clientesPorFrecuencia,
        productosPorFrecuencia,
        dronesPorFrecuencia,
        colaboradoresPorFrecuencia,
        tierrasPorFrecuencia,
        climasPorFrecuencia,
        razonesPorFrecuencia,
        etapasPorFrecuencia,
        tendenciaTemporal,
        efectividadProductos,
        rendimientoDrones,
        efectividadColaboradores,
        impactoClimatico
      };
    })
  );
}

private contarFrecuencia(informes: Informe[], campo: keyof Informe): {[key: string]: number} {
  return informes.reduce((acc, informe) => {
    const valor = informe[campo] as string;
    acc[valor] = (acc[valor] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});
}

private analizarTendenciaTemporal(informes: Informe[]): any {
  const tendencia = informes.reduce((acc, informe) => {
    const fecha = new Date(informe.fechaSeguimiento).toISOString().split('T')[0];
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  return Object.entries(tendencia).sort(([a], [b]) => a.localeCompare(b));
}

private analizarEfectividadProductos(informes: Informe[]): any {
  const efectividad = informes.reduce((acc, informe) => {
    if (!acc[informe.producto]) {
      acc[informe.producto] = { total: 0, exito: 0 };
    }
    acc[informe.producto].total++;
    if (informe.resultado === 'Éxito') {
      acc[informe.producto].exito++;
    }
    return acc;
  }, {} as {[key: string]: {total: number, exito: number}});

  return Object.entries(efectividad).map(([producto, stats]) => ({
    producto,
    efectividad: (stats.exito / stats.total) * 100
  }));
}

private analizarRendimientoDrones(informes: Informe[]): any {
  return this.analizarEfectividadPorCampo(informes, 'drone');
}

private analizarEfectividadColaboradores(informes: Informe[]): any {
  return this.analizarEfectividadPorCampo(informes, 'colaboradorNombre');
}

private analizarImpactoClimatico(informes: Informe[]): any {
  return this.analizarEfectividadPorCampo(informes, 'clima');
}

private analizarEfectividadPorCampo(informes: Informe[], campo: keyof Informe): any {
  const efectividad = informes.reduce((acc, informe) => {
    const valor = informe[campo] as string;
    if (!acc[valor]) {
      acc[valor] = { total: 0, exito: 0 };
    }
    acc[valor].total++;
    if (informe.resultado === 'Éxito') {
      acc[valor].exito++;
    }
    return acc;
  }, {} as {[key: string]: {total: number, exito: number}});

  return Object.entries(efectividad).map(([valor, stats]) => ({
    valor,
    efectividad: (stats.exito / stats.total) * 100
  }));
}
}