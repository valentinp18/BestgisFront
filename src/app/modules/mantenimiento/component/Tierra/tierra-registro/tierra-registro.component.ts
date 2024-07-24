import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TierraService } from '../../../service/Tierra.service';

@Component({
  selector: 'app-tierra-registro',
  templateUrl: './tierra-registro.component.html',
  styleUrls: ['./tierra-registro.component.scss']
})
export class TierraRegistroComponent implements OnInit {
  tierra: any = { nombre: '', descripcion: '' };
  id: string | null = null;

  constructor(
    private tierraService: TierraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.tierraService.getTierra(this.id).subscribe(data => {
        this.tierra = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.tierraService.updateTierra(this.id, this.tierra)
        .then(() => {
          console.log('Tierra actualizada con éxito');
          this.navigateToList();
         })
        .catch(err => console.error('Error al actualizar tierra:', err));
    } else {
      this.tierraService.createTierra(this.tierra)
        .then(() => {
          console.log('Tierra creada con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear tierra:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/tierra']);
  }
}