import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampoAgricolaService } from '../../../service/CampoAgricola.service';

@Component({
  selector: 'app-campo-agricola-registro',
  templateUrl: './campo-agricola-registro.component.html',
  styleUrls: ['./campo-agricola-registro.component.scss']
})
export class CampoAgricolaRegistroComponent implements OnInit {
  campoAgricola: any = {
    tipo_tierra: '',
    departamento: '',
    provincia: '',
    distrito: '',
    centro_poblado: '',
    gps: ''
  };
  id: string | null = null;
  ubicaciones: any[] = [];

  constructor(
    private campoAgricolaService: CampoAgricolaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.campoAgricolaService.getCampoAgricola(this.id).subscribe(data => {
        this.campoAgricola = data;
      });
    }
    this.loadUbicaciones();
  }

  loadUbicaciones(): void {
    this.campoAgricolaService.getUbicaciones().subscribe(data => {
      this.ubicaciones = data;
    });
  }

  onSubmit(): void {
    if (this.id) {
      this.campoAgricolaService.updateCampoAgricola(this.id, this.campoAgricola)
        .then(() => {
          console.log('Campo agrícola actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar campo agrícola:', err));
    } else {
      this.campoAgricolaService.createCampoAgricola(this.campoAgricola)
        .then(() => {
          console.log('Campo agrícola creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear campo agrícola:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/campo']);
  }

  onUbicacionSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const ubicacionId = selectElement.value;
    const ubicacionSeleccionada = this.ubicaciones.find(u => u.id === ubicacionId);
    
    if (ubicacionSeleccionada) {
      this.campoAgricola.departamento = ubicacionSeleccionada.departamento;
      this.campoAgricola.provincia = ubicacionSeleccionada.provincia;
      this.campoAgricola.distrito = ubicacionSeleccionada.distrito;
      this.campoAgricola.centro_poblado = ubicacionSeleccionada.centro_poblado;
      this.campoAgricola.gps = ubicacionSeleccionada.gps;
    }
  }
}