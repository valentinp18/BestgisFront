import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoService, Seguimiento } from '../../../service/Seguimiento.service';
import { Observable, of, forkJoin, from, Subscription } from 'rxjs';

interface Evidencia {
  tipo: 'imagen' | 'video';
  url: string;
}

@Component({
  selector: 'app-seguimiento-registro',
  templateUrl: './seguimiento-registro.component.html',
  styleUrls: ['./seguimiento-registro.component.scss']
})
export class SeguimientoRegistroComponent implements OnInit, OnDestroy {
  seguimiento: Seguimiento = {
    misionId: '',
    ultimo_id: 0,
    fechaSeguimiento: '',
    fechaFinal: '',
    estado: 'En progreso',
    observaciones: '',
    evidenciasAdicionales: [],
    colaboradorId: ''
  };
  isEditing: boolean = false;
  colaboradores: any[] = [];
  evidencias: Evidencia[] = [];
  isLoading: boolean = false;
  private misionFechaSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seguimientoService: SeguimientoService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.loadSeguimiento(id);
      } else {
        this.isEditing = false;
        this.route.queryParamMap.subscribe(queryParams => {
          const misionId = queryParams.get('misionId');
          if (misionId) {
            this.seguimiento.misionId = misionId;
            this.loadFechaInicio(misionId);
            this.observeMisionFecha(misionId);
          }
        });
      }
    });
    this.loadColaboradores();
    
    if (!this.isEditing) {
      this.seguimiento.fechaFinal = new Date().toISOString().split('T')[0];
    }
  }

  ngOnDestroy() {
    if (this.misionFechaSubscription) {
      this.misionFechaSubscription.unsubscribe();
    }
  }

  loadSeguimiento(id: string) {
    this.isLoading = true;
    this.seguimientoService.getSeguimiento(id).subscribe(
      seguimiento => {
        if (seguimiento) {
          this.seguimiento = seguimiento;
          this.evidencias = seguimiento.evidenciasAdicionales.map(url => ({
            tipo: url.includes('.mp4') ? 'video' : 'imagen',
            url: url
          }));
          if (seguimiento.misionId) {
            this.observeMisionFecha(seguimiento.misionId);
          }
        } else {
          this.router.navigate(['/dashboard/servicio/seguimiento']);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el seguimiento:', error);
        this.router.navigate(['/dashboard/servicio/seguimiento']);
        this.isLoading = false;
      }
    );
  }

  loadFechaInicio(misionId: string) {
    this.seguimientoService.getMisionFecha(misionId).subscribe(
      fecha => {
        this.seguimiento.fechaSeguimiento = fecha;
      },
      error => {
        console.error('Error al cargar la fecha de inicio:', error);
      }
    );
  }

  private observeMisionFecha(misionId: string) {
    this.misionFechaSubscription = this.seguimientoService.observeMisionFecha(misionId)
      .subscribe(nuevaFecha => {
        if (nuevaFecha && nuevaFecha !== this.seguimiento.fechaSeguimiento) {
          this.seguimiento.fechaSeguimiento = nuevaFecha;
          if (this.seguimiento.id) {
            this.seguimientoService.actualizarFechaSeguimiento(this.seguimiento.id, nuevaFecha);
          }
        }
      });
  }

  loadColaboradores() {
    this.seguimientoService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Error al cargar colaboradores:', error);
      }
    );
  }

  onEstadoChange() {
    if (this.seguimiento.estado === 'En progreso') {
      this.seguimiento.resultado = undefined;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const tipo = file.type.startsWith('image/') ? 'imagen' : 'video';
      
      if (this.isEditing && this.seguimiento.id) {
        this.seguimientoService.uploadEvidencia(this.seguimiento.id, file, tipo).subscribe(
          evidencia => {
            this.evidencias.push(evidencia);
            this.seguimiento.evidenciasAdicionales = [...this.seguimiento.evidenciasAdicionales, evidencia.url];
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
    if (this.isEditing && this.seguimiento.id) {
      this.isLoading = true;
      this.seguimientoService.removeEvidencia(this.seguimiento.id, evidencia).subscribe(
        () => {
          const index = this.evidencias.findIndex(e => e.url === evidencia.url);
          if (index !== -1) {
            this.evidencias.splice(index, 1);
          }
          this.seguimiento.evidenciasAdicionales = this.seguimiento.evidenciasAdicionales.filter(url => url !== evidencia.url);
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

  onFechaFinalChange() {
    if (this.seguimiento.fechaSeguimiento && this.seguimiento.fechaFinal) {
      const fechaInicio = new Date(this.seguimiento.fechaSeguimiento);
      const fechaFinal = new Date(this.seguimiento.fechaFinal);
      
      if (fechaFinal < fechaInicio) {
        alert('La fecha final no puede ser anterior a la fecha de inicio.');
        this.seguimiento.fechaFinal = this.seguimiento.fechaSeguimiento;
      }
    }
  }

  guardarSeguimiento() {
    if (this.seguimiento.fechaSeguimiento && this.seguimiento.fechaFinal) {
      const fechaInicio = new Date(this.seguimiento.fechaSeguimiento);
      const fechaFinal = new Date(this.seguimiento.fechaFinal);
      
      if (fechaFinal < fechaInicio) {
        alert('La fecha final no puede ser anterior a la fecha de inicio.');
        return;
      }
    }

    if (this.seguimiento.estado === 'En progreso') {
      this.seguimiento.resultado = undefined;
    }

    const seguimientoToSave = {
      ...this.seguimiento,
      evidenciasAdicionales: this.evidencias.map(e => e.url)
    };

    if (this.isEditing && this.seguimiento.id) {
      this.seguimientoService.actualizarSeguimiento(seguimientoToSave)
        .then(() => this.uploadEvidencias(this.seguimiento.id!))
        .then(() => {
          this.router.navigate(['/dashboard/servicio/seguimiento']);
        })
        .catch(error => {
          console.error('Error al actualizar seguimiento:', error);
        });
    } else {
      this.seguimientoService.crearSeguimiento(seguimientoToSave)
        .then(id => this.uploadEvidencias(id))
        .then(() => {
          this.router.navigate(['/dashboard/servicio/seguimiento']);
        })
        .catch(error => {
          console.error('Error al agregar seguimiento:', error);
        });
    }
  }

  private uploadEvidencias(seguimientoId: string): Observable<any> {
    if (this.evidencias.length === 0) {
      return of(null);
    }

    const uploadObservables = this.evidencias.map(evidencia => {
      if (evidencia.url.startsWith('data:')) {
        return from(fetch(evidencia.url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `evidencia.${evidencia.tipo === 'imagen' ? 'jpg' : 'mp4'}`, { type: blob.type });
            return this.seguimientoService.uploadEvidencia(seguimientoId, file, evidencia.tipo).toPromise();
          }));
      } else {
        return of(evidencia);
      }
    });

    return forkJoin(uploadObservables);
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/servicio/seguimiento']);
  }
}