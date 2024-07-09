import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClimaService } from '../../../service/Clima.service';

@Component({
  selector: 'app-clima-registro',
  templateUrl: './clima-registro.component.html',
  styleUrls: ['./clima-registro.component.scss']
})
export class ClimaRegistroComponent implements OnInit {
  clima: any = { nombre: '', descripcion: '' };
  id: string | null = null;

  constructor(
    private climaService: ClimaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.climaService.getClima(this.id).subscribe(data => {
        this.clima = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.climaService.updateClima(this.id, this.clima)
        .then(() => {
          console.log('Clima actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar clima:', err));
    } else {
      this.climaService.createClima(this.clima)
        .then(() => {
          console.log('Clima creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear clima:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/clima']);
  }
}