import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MisionService } from '../../../service/Mision.service';

@Component({
  selector: 'app-mision-registro',
  templateUrl: './mision-registro.component.html',
  styleUrls: ['./mision-registro.component.scss']
})
export class MisionRegistroComponent implements OnInit {
  mision: any = {
    fecha: '',
    razon: '',
    observacion: '',
    cultivo_id: '',
    campo_agricola_id: '',
    producto_id: '',
    drone_id: '',
    colaborador_id: ''
  };

  id: string | null = null;
  isLoading: boolean = false;

  cultivos: any[] = [];
  campos_agricolas: any[] = [];
  productos: any[] = [];
  drones: any[] = [];
  colaboradores: any[] = [];

  razones: string[] = ['Control de Enfermedades', 'Prevención', 'Fertilización', 'Otros'];
  razonSeleccionada: string = '';
  razonPersonalizada: string = '';

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
    this.misionService.getCultivos().subscribe(data => this.cultivos = data);
    this.misionService.getCamposAgricolas().subscribe(data => this.campos_agricolas = data);
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
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar la misión:', error);
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

    if (this.id) {
      this.misionService.updateMision(this.id, this.mision)
        .then(() => {
          console.log('Misión actualizada con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar misión:', err));
    } else {
      this.misionService.createMision(this.mision)
        .then(() => {
          console.log('Misión creada con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear misión:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/servicio/mision']);
  }
}