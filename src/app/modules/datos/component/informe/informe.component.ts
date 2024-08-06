import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InformeService, Informe } from '../../service/Informe.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map, take } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface InformeExcel {
  'ID Misión': number;
  Cliente: string;
  Cultivo: string;
  'Etapa de Cultivo': string;
  Razón: string;
  Ubicación: string;
  Tierra: string;
  Clima: string;
  Producto: string;
  Drone: string;
  'Observación de Misión': string;
  'Fecha Inicio': string;
  'Fecha Final': string;
  Duración: string;
  'Observación de Seguimiento': string;
  Resultado: string;
}

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit {
  informes$: Observable<Informe[]> = of([]);
  informesFiltrados$: BehaviorSubject<Informe[]> = new BehaviorSubject<Informe[]>([]);
  misionId: string | null = null;
  filtroBusqueda: string = '';
  
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  totalPaginas: number = 1;

  filtroActual: string = 'Todos';
  filtroResultado: string = '';
  filtroFechaInicial: string = '';
  filtroFechaFinal: string = '';

  constructor(
    private route: ActivatedRoute,
    private informeService: InformeService
  ) {}

  ngOnInit() {
    this.informes$ = this.route.queryParamMap.pipe(
      switchMap(params => {
        const ultimoId = params.get('ultimo_id');
        if (ultimoId) {
          return this.informeService.getInformesByUltimoId(ultimoId);
        } else {
          return this.informeService.getAllInformes();
        }
      }),
      map(informes => this.ordenarPorUltimoId(informes)),
      tap(informes => {
        this.calcularTotalPaginas(informes.length);
        this.actualizarInformesFiltrados(informes);
      })
    );
    this.informes$.subscribe();

    this.route.queryParamMap.subscribe(params => {
      const ultimoId = params.get('ultimo_id');
      if (ultimoId) {
        this.filtroBusqueda = ultimoId;
        this.buscarPorIdMision();
      }
    });
  }

  ordenarPorUltimoId(informes: Informe[]): Informe[] {
    return informes.sort((a, b) => b.ultimo_id - a.ultimo_id);
  }

  aplicarFiltros() {
    this.informes$.pipe(take(1)).subscribe(informes => {
      let filtrados = informes.filter(i => i.estado === 'Finalizado');

      if (this.filtroActual === 'Resultado' && this.filtroResultado) {
        filtrados = filtrados.filter(i => i.resultado === this.filtroResultado);
      } else if (this.filtroActual === 'Fechas' && this.filtroFechaInicial && this.filtroFechaFinal) {
        const fechaInicial = new Date(this.filtroFechaInicial);
        const fechaFinal = new Date(this.filtroFechaFinal);
        filtrados = filtrados.filter(i => {
          const fechaInforme = new Date(i.fechaFinal || i.fechaSeguimiento);
          return fechaInforme >= fechaInicial && fechaInforme <= fechaFinal;
        });
      }

      if (this.filtroBusqueda) {
        filtrados = filtrados.filter(i => i.ultimo_id === parseInt(this.filtroBusqueda));
      }

      this.calcularTotalPaginas(filtrados.length);
      this.informesFiltrados$.next(filtrados);
    });
  }

  cambiarFiltro(filtro: string) {
    this.filtroActual = filtro;
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  cambiarResultado(resultado: string) {
    this.filtroResultado = resultado;
    this.aplicarFiltros();
  }

  aplicarFiltroFechas() {
    this.aplicarFiltros();
  }

  buscarPorIdMision() {
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  actualizarInformesFiltrados(informes: Informe[]) {
    let filtrados = informes.filter(i => i.estado === 'Finalizado');
    if (this.filtroBusqueda) {
      filtrados = filtrados.filter(i => i.ultimo_id === parseInt(this.filtroBusqueda));
    }
    this.calcularTotalPaginas(filtrados.length);
    this.informesFiltrados$.next(filtrados);
  }

  calcularTotalPaginas(totalRegistros: number) {
    this.totalPaginas = Math.ceil(totalRegistros / this.registrosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  obtenerInformesPaginados(): Informe[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.informesFiltrados$.value.slice(inicio, fin);
  }

  parseFecha(fechaString: string): Date {
    const fecha = new Date(fechaString);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    return fecha;
  }

  calcularDuracion(fechaInicial: string, fechaFinal: string | undefined): string {
    if (!fechaFinal) {
      return 'En progreso';
    }
    
    const inicio = new Date(fechaInicial);
    const fin = new Date(fechaFinal);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.floor(diferencia / (1000 * 3600 * 24));
    
    return dias === 1 ? '1 día' : `${dias} días`;
  }

  exportarExcel(): void {
    this.informesFiltrados$.pipe(take(1)).subscribe(informes => {
      const datos: InformeExcel[] = informes.map(informe => ({
        'ID Misión': informe.ultimo_id,
        'Cliente': informe.cliente,
        'Cultivo': informe.cultivo,
        'Etapa de Cultivo': informe.etapaCultivo,
        'Razón': informe.razon,
        'Ubicación': informe.ubicacion,
        'Tierra': informe.tierra,
        'Clima': informe.clima,
        'Producto': informe.producto,
        'Drone': informe.drone,
        'Observación de Misión': informe.observacionMision,
        'Fecha Inicio': this.parseFecha(informe.fechaSeguimiento).toLocaleDateString(),
        'Fecha Final': informe.fechaFinal ? new Date(informe.fechaFinal).toLocaleDateString() : 'No especificada',
        'Duración': this.calcularDuracion(informe.fechaSeguimiento, informe.fechaFinal),
        'Observación de Seguimiento': informe.observaciones,
        'Resultado': informe.resultado || 'No especificado'
      }));
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Informe');
    const columnas = Object.keys(datos[0]).map(key => ({ header: key, key: key, width: 15 }));
    worksheet.columns = columnas;
    worksheet.addRows(datos);
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      if (cell) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' }
        };
        cell.font = {
          color: { argb: 'FFFFFF' },
          bold: true
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (cell) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          if (rowNumber !== 1) {  
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
        }
      });
    });

    worksheet.columns.forEach(column => {
      if (column && column.eachCell) {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          if (cell && cell.value) {
            const columnLength = cell.value.toString().length;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          }
        });
        column.width = Math.min(maxLength + 2, 50);  
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Informe_Bestgis.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  });
  }

  exportarPDF(): void {
    this.informesFiltrados$.pipe(take(1)).subscribe(informes => {
      const doc = new jsPDF('l', 'mm', 'a4');  
      const tableColumn = [
        "ID Misión", "Cliente", "Cultivo", "Etapa", "Razón", "Ubicación", 
        "Tierra", "Clima", "Producto", "Drone", "Observación Misión",
        "Fecha Inicio", "Fecha Final", "Duración", "Observación Seguimiento", "Resultado"
      ];
      const tableRows: any[][] = [];
  
      informes.forEach(informe => {
        const informeData = [
          informe.ultimo_id,
          informe.cliente,
          informe.cultivo,
          informe.etapaCultivo,
          informe.razon,
          informe.ubicacion,
          informe.tierra,
          informe.clima,
          informe.producto,
          informe.drone,
          informe.observacionMision,
          this.parseFecha(informe.fechaSeguimiento).toLocaleDateString(),
          informe.fechaFinal ? new Date(informe.fechaFinal).toLocaleDateString() : 'No especificada',
          this.calcularDuracion(informe.fechaSeguimiento, informe.fechaFinal),
          informe.observaciones,
          informe.resultado || 'No especificado'
        ];
        tableRows.push(informeData);
      });
  
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8, cellPadding: 1 },
        columnStyles: { 
          0: { cellWidth: 15 },  
          1: { cellWidth: 20 },  
        },
        headStyles: { fillColor: [179, 217, 255], textColor: 0 }, 
      });
  
      doc.save('Informe_Bestgis.pdf');
    });
  }
}