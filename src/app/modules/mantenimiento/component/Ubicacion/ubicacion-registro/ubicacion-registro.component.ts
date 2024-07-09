import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionService } from '../../../service/Ubicacion.service';

@Component({
  selector: 'app-ubicacion-registro',
  templateUrl: './ubicacion-registro.component.html',
  styleUrls: ['./ubicacion-registro.component.scss']
})
export class UbicacionRegistroComponent implements OnInit {
  ubicacion: any = { departamento: '', provincia: '', distrito: '', centro_poblado: '', gps: '' };
  id: string | null = null;

  constructor(
    private ubicacionService: UbicacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ubicacionService.getUbicacion(this.id).subscribe(data => {
        this.ubicacion = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.ubicacionService.updateUbicacion(this.id, this.ubicacion)
        .then(() => {
          console.log('Ubicación actualizada con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar ubicación:', err));
    } else {
      this.ubicacionService.createUbicacion(this.ubicacion)
        .then(() => {
          console.log('Ubicación creada con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear ubicación:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/ubicacion']);
  }
}
