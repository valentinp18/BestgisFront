import { Component, OnInit } from '@angular/core';
import { MisionService } from '../../../service/Mision.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-mision-lista',
  templateUrl: './mision-lista.component.html',
  styleUrls: ['./mision-lista.component.scss']
})
export class MisionListaComponent implements OnInit {
  misiones: any[] = [];
  misionesFiltradas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filtroBusqueda: string = '';

  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(
    private misionService: MisionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getMisiones();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getMisiones();
    });
  }

  getMisiones(): void {
    this.misionService.getMisiones().subscribe(
      data => {
        this.misiones = this.ordenarPorIdMision(data);
        this.actualizarMisionesFiltradas(this.misiones);
      },
      error => console.error('Error al obtener misiones:', error)
    );
  }

  ordenarPorIdMision(misiones: any[]): any[] {
    return misiones.sort((a, b) => b.ultimo_id - a.ultimo_id);
  }

  actualizarMisionesFiltradas(misiones: any[]) {
    const filtradas = this.filtrarPorBusqueda(misiones);
    this.calcularTotalPaginas(filtradas.length);
    this.misionesFiltradas.next(filtradas);
  }

  filtrarPorBusqueda(misiones: any[]): any[] {
    if (!this.filtroBusqueda) {
      return misiones;
    }
    return misiones.filter(m => m.ultimo_id === parseInt(this.filtroBusqueda));
  }

  buscarPorIdMision() {
    this.paginaActual = 1;
    this.actualizarMisionesFiltradas(this.misiones);
  }

  calcularTotalPaginas(totalRegistros: number) {
    this.totalPaginas = Math.ceil(totalRegistros / this.registrosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  obtenerMisionesPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.misionesFiltradas.value.slice(inicio, fin);
  }

  deleteMision(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta misión?')) {
      this.misionService.deleteMision(id).subscribe(
        () => {
          console.log('Misión eliminada');
          this.getMisiones();
        },
        (err: any) => console.error('Error al eliminar misión:', err)
      );
    }
  }

  verSeguimiento(mision: any) {
    this.router.navigate(['dashboard/servicio/seguimiento'], { queryParams: { ultimo_id: mision.ultimo_id } });
  }
}