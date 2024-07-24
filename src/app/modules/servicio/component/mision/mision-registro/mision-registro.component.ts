import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MisionService } from '../../../service/Mision.service';
import { Observable, of, forkJoin, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface Evidencia {
  tipo: 'imagen' | 'video';
  url: string;
}

@Component({
  selector: 'app-mision-registro',
  templateUrl: './mision-registro.component.html',
  styleUrls: ['./mision-registro.component.scss']
})
export class MisionRegistroComponent implements OnInit {
  mision: any = {
    ultimo_id: null,
    fecha: '',
    razon: '',
    observacion: '',
    cultivo_id: '',
    etapa_cultivo: '',
    ubicacion_id: '',
    producto_id: '',
    drone_id: '',
    colaborador_id: '',
    cliente_id: '',
    tierra_id: '',
    clima_id: '',
    evidencias: []
  };

  id: string | null = null;
  isLoading: boolean = false;

  cultivos: any[] = [];
  etapasCultivo: string[] = [];
  ubicaciones: any[] = [];
  productos: any[] = [];
  drones: any[] = [];
  colaboradores: any[] = [];
  clientes: any[] = [];

  tierras: any[] = [];
  climas: any[] = [];

  razones: string[] = ['Control de Enfermedades', 'Prevención', 'Fertilización', 'Otros'];
  razonSeleccionada: string = '';
  razonPersonalizada: string = '';
  evidencias: Evidencia[] = [];

  constructor(
    private misionService: MisionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadOptions();
    if (this.id) {
      this.loadMision(this.id);
    }
  }

  loadOptions(): void {
    this.misionService.getCultivos().subscribe(data => {
      this.cultivos = data;
      if (this.mision.cultivo_id) {
        this.actualizarEtapasCultivo();
      }
    });
    this.misionService.getUbicaciones().subscribe(data => this.ubicaciones = data);
    this.misionService.getProductos().subscribe(data => this.productos = data);
    this.misionService.getDrones().subscribe(data => this.drones = data);
    this.misionService.getColaboradores().subscribe(data => {
      this.colaboradores = data;
      this.colaboradores.forEach(colaborador => {
        this.misionService.getPersona(colaborador.persona_id).subscribe(persona => {
          colaborador.nombre = persona.nombre;
          colaborador.apellido = persona.apellido;
        });
      });
    });
    this.misionService.getClientes().subscribe(data => {
      this.clientes = data;
      this.clientes.forEach(cliente => {
        this.misionService.getPersona(cliente.persona_id).subscribe(persona => {
          cliente.nombre = persona.nombre;
          cliente.apellido = persona.apellido;
        });
      });
    });
    this.misionService.getTierras().subscribe(data => this.tierras = data);
    this.misionService.getClimas().subscribe(data => this.climas = data);
  }

  loadMision(id: string): void {
    this.isLoading = true;
    this.misionService.getMision(id).subscribe(
      data => {
        this.mision = data;
        this.razonSeleccionada = this.razones.includes(this.mision.razon) ? this.mision.razon : 'Otros';
        if (this.razonSeleccionada === 'Otros') {
          this.razonPersonalizada = this.mision.razon;
        }
        this.actualizarEtapasCultivo();
        this.evidencias = this.mision.evidencias || [];
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  onRazonChange() {
    if (this.razonSeleccionada !== 'Otros') {
      this.mision.razon = this.razonSeleccionada;
      this.razonPersonalizada = '';
    }
  }

  onRazonPersonalizadaChange() {
    if (this.razonSeleccionada === 'Otros') {
      this.mision.razon = this.razonPersonalizada;
    }
  }

  onSubmit(): void {
    if (this.razonSeleccionada === 'Otros') {
      this.mision.razon = this.razonPersonalizada;
    }
  
    const misionToSend = {
      ...this.mision,
      etapa_cultivo: this.mision.etapa_cultivo,
    };
  
    if ('cultivo_etapa' in misionToSend) {
      delete misionToSend.cultivo_etapa;
    }
  
    if (this.id) {
      this.misionService.updateMision(this.id, misionToSend)
        .pipe(
          switchMap(() => {
            if (this.id) {
              return this.uploadEvidencias(this.id);
            } else {
              console.error('ID de misión no disponible');
              return of(null);
            }
          })
        )
        .subscribe(
          () => {
            this.navigateToList();
          },
          err => {
            console.error('Error al actualizar la misión:', err);
          }
        );
    } else {
      this.misionService.createMisionWithTracking(misionToSend)
        .pipe(
          switchMap(id => this.uploadEvidencias(id))
        )
        .subscribe(
          () => {
            this.navigateToList();
          },
          err => {
            console.error('Error al crear la misión:', err);
          }
        );
    }
  }

  private uploadEvidencias(misionId: string): Observable<any> {
    if (this.evidencias.length === 0) {
      return of(null);
    }

    const uploadObservables = this.evidencias.map(evidencia => {
      if (evidencia.url.startsWith('data:')) {
        return from(fetch(evidencia.url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `evidencia.${evidencia.tipo === 'imagen' ? 'jpg' : 'mp4'}`, { type: blob.type });
            return this.misionService.uploadEvidencia(misionId, file, evidencia.tipo).toPromise();
          }));
      } else {
        return of(evidencia);
      }
    });

    return forkJoin(uploadObservables);
  }

  deleteMision() {
    if (this.id) {
      this.misionService.deleteMision(this.id).subscribe(
        () => {
          this.router.navigate(['dashboard/servicio/mision']);
        },
        error => {
          console.error('Error al eliminar la misión:', error);
        }
      );
    }
  }

  actualizarEtapasCultivo(): void {
    const cultivoSeleccionado = this.cultivos.find(c => c.id === this.mision.cultivo_id);
    if (cultivoSeleccionado && cultivoSeleccionado.etapas) {
      this.etapasCultivo = cultivoSeleccionado.etapas;
    } else {
      this.etapasCultivo = [];
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const tipo = file.type.startsWith('image/') ? 'imagen' : 'video';
      
      if (this.id) {
        this.misionService.uploadEvidencia(this.id, file, tipo).subscribe(
          evidencia => {
            this.evidencias.push(evidencia);
          },
          error => {
            console.error('Error al subir la evidencia:', error);
          }
        );
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const evidencia: Evidencia = { tipo, url: e.target.result };
          this.evidencias.push(evidencia);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeEvidencia(evidencia: Evidencia) {
    if (this.id) {
      this.isLoading = true; 
      this.misionService.removeEvidencia(this.id, evidencia).subscribe(
        () => {
          const index = this.evidencias.findIndex(e => e.url === evidencia.url);
          if (index !== -1) {
            this.evidencias.splice(index, 1);
          }
          this.isLoading = false; 
        },
        error => {
          console.error('Error al eliminar la evidencia:', error);
          this.isLoading = false; 
        }
      );
    } else {
      const index = this.evidencias.findIndex(e => e.url === evidencia.url);
      if (index !== -1) {
        this.evidencias.splice(index, 1);
      }
    }
  }

  onCultivoChange(): void {
    this.actualizarEtapasCultivo();
    if (!this.etapasCultivo.includes(this.mision.etapa_cultivo)) {
      this.mision.etapa_cultivo = '';
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/servicio/mision']);
  }
}