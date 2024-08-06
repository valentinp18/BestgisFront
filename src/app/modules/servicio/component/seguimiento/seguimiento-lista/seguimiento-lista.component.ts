import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoService, Seguimiento } from '../../../service/Seguimiento.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map, take  } from 'rxjs/operators';

@Component({
  selector: 'app-seguimiento-lista',
  templateUrl: './seguimiento-lista.component.html',
  styleUrls: ['./seguimiento-lista.component.scss']
})
export class SeguimientoListaComponent implements OnInit {
  seguimientos$: Observable<Seguimiento[]> = of([]);
  seguimientosFiltrados$: BehaviorSubject<Seguimiento[]> = new BehaviorSubject<Seguimiento[]>([]);
  misionId: string | null = null;
  filtroEstado: string = 'Todos';
  filtroBusqueda: string = '';
  
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seguimientoService: SeguimientoService
  ) {}

  ngOnInit() {
    this.seguimientos$ = this.route.queryParamMap.pipe(
      switchMap(params => {
        const ultimoId = params.get('ultimo_id');
        if (ultimoId) {
          return this.seguimientoService.getSeguimientosByUltimoId(ultimoId);
        } else {
          return this.seguimientoService.getAllSeguimientos();
        }
      }),
      map(seguimientos => this.ordenarPorUltimoId(seguimientos)),
      tap(seguimientos => {
        this.calcularTotalPaginas(seguimientos.length);
        this.actualizarSeguimientosFiltrados(seguimientos);
      })
    );
    this.seguimientos$.subscribe();
    this.route.queryParamMap.subscribe(params => {
      const ultimoId = params.get('ultimo_id');
      if (ultimoId) {
        this.filtroBusqueda = ultimoId;
        this.buscarPorIdMision();
      }
    });
  }
  
  ordenarPorUltimoId(seguimientos: Seguimiento[]): Seguimiento[] {
    return seguimientos.sort((a, b) => b.ultimo_id - a.ultimo_id);
  }
  
  filtrarPorEstado(seguimientos: Seguimiento[]): Seguimiento[] {
    let filtrados = seguimientos;
    if (this.filtroEstado !== 'Todos') {
      filtrados = filtrados.filter(s => s.estado === this.filtroEstado);
    }
    if (this.filtroBusqueda) {
      filtrados = filtrados.filter(s => s.ultimo_id.toString().includes(this.filtroBusqueda));
    }
    return filtrados;
  }

  cambiarFiltro(estado: string) {
    this.filtroEstado = estado;
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  buscarPorIdMision() {
    this.paginaActual = 1;
    this.aplicarFiltros();
  }
  
  aplicarFiltros() {
    this.seguimientos$.pipe(
      take(1)
    ).subscribe(seguimientos => {
      this.actualizarSeguimientosFiltrados(seguimientos);
    });
  }

  actualizarSeguimientosFiltrados(seguimientos: Seguimiento[]) {
    let filtrados = seguimientos;
    if (this.filtroEstado !== 'Todos') {
      filtrados = filtrados.filter(s => s.estado === this.filtroEstado);
    }
    if (this.filtroBusqueda) {
      filtrados = filtrados.filter(s => s.ultimo_id === parseInt(this.filtroBusqueda));
    }
    this.calcularTotalPaginas(filtrados.length);
    this.seguimientosFiltrados$.next(filtrados);
  }

  calcularTotalPaginas(totalRegistros: number) {
    this.totalPaginas = Math.ceil(totalRegistros / this.registrosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  obtenerSeguimientosPaginados(): Seguimiento[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.seguimientosFiltrados$.value.slice(inicio, fin);
  }
  
  parseFecha(fechaString: string): Date {
    const fecha = new Date(fechaString);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    return fecha;
  }

  actualizarSeguimiento(seguimiento: Seguimiento) {
    this.router.navigate(['/dashboard/servicio/seguimiento/registro', seguimiento.id]);
  }
}