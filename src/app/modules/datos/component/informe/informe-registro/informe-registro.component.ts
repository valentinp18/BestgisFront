import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformeService } from '../../../service/Informe.service';

@Component({
  selector: 'app-informe-registro',
  templateUrl: './informe-registro.component.html',
  styleUrls: ['./informe-registro.component.scss']
})
export class InformeRegistroComponent implements OnInit {
  informe: any = {
    nombre: '',
    observacion: '',
    url_evidencia: '',
    fecha_informe: '',
    clima_id: '',
    mision_id: ''
  };

  id: string | null = null;
  isLoading: boolean = false;

  climas: any[] = [];
  misiones: any[] = [];

  constructor(
    private informeService: InformeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadOptions();
    if (this.id) {
      this.loadInforme(this.id);
    }
  }

  loadOptions(): void {
    this.informeService.getClimas().subscribe(data => this.climas = data);
    this.informeService.getMisiones().subscribe(data => this.misiones = data);
  }

  loadInforme(id: string): void {
    this.isLoading = true;
    this.informeService.getInforme(id).subscribe(
      data => {
        this.informe = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el informe:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.id) {
      this.informeService.updateInforme(this.id, this.informe)
        .then(() => {
          console.log('Informe actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar informe:', err));
    } else {
      this.informeService.createInforme(this.informe)
        .then(() => {
          console.log('Informe creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear informe:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/datos/informe']);
  }
}