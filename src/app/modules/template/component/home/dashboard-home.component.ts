import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { InformeService } from '../../../datos/service/Informe.service';
import { Observable } from 'rxjs';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  estadisticas$!: Observable<any>;
  charts: Chart[] = [];

  constructor(private informeService: InformeService) {}

  ngOnInit() {
    this.estadisticas$ = this.informeService.getEstadisticas();
  }

  ngAfterViewInit() {
    this.estadisticas$.subscribe(stats => {
      this.crearGraficos(stats);
    });
  }

  ngOnDestroy() {
    this.charts.forEach(chart => chart.destroy());
  }

  crearGraficos(stats: any) {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
 
    this.crearGraficoCultivos(stats.cultivosPorFrecuencia);
    this.crearGraficoUbicaciones(stats.ubicacionesPorFrecuencia);
    this.crearGraficoEfectividadProductos(stats.efectividadProductos);
    this.crearGraficoRendimientoDrones(stats.rendimientoDrones);
  }

  crearGraficoCultivos(data: { [key: string]: number }) {
    const ctx = document.getElementById('cultivosChart') as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Frecuencia de Cultivos',
              data: Object.values(data),
              backgroundColor: Object.keys(data).map(() => this.getRandomColor()),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Frecuencia de Cultivos',
            },
          },
        },
      });
      this.charts.push(chart);
    }
  }
  
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  crearGraficoUbicaciones(data: {[key: string]: number}) {
    const ctx = document.getElementById('ubicacionesChart') as HTMLCanvasElement;
    if (ctx) {
      const config: ChartConfiguration<ChartType> = {
        type: 'pie',
        data: {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Ubicaciones más frecuentes'
            }
          }
        }
      };
      const chart = new Chart(ctx, config);
      this.charts.push(chart);
    }
  }
  
  crearGraficoEfectividadProductos(data: {producto: string, efectividad: number}[]) {
    const ctx = document.getElementById('efectividadProductosChart') as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.producto),
          datasets: [{
            label: 'Efectividad (%)',
            data: data.map(item => item.efectividad),
            backgroundColor: 'rgba(255, 159, 64, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Efectividad de Productos'
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
  
  crearGraficoRendimientoDrones(data: {valor: string, efectividad: number}[]) {
    const ctx = document.getElementById('rendimientoDronesChart') as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.valor),
          datasets: [{
            label: 'Rendimiento (%)',
            data: data.map(item => item.efectividad),
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Rendimiento de Drones'
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
}