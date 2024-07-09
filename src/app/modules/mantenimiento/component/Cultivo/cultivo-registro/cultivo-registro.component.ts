import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CultivoService } from '../../../service/Cultivo.service';

@Component({
  selector: 'app-cultivo-registro',
  templateUrl: './cultivo-registro.component.html',
  styleUrls: ['./cultivo-registro.component.scss']
})
export class CultivoRegistroComponent implements OnInit {
  cultivo: any = { nombre: '', descripcion: '', etapa: '', tipo: '' };
  id: string | null = null;

  constructor(
    private cultivoService: CultivoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.cultivoService.getCultivo(this.id).subscribe(data => {
        this.cultivo = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.cultivoService.updateCultivo(this.id, this.cultivo)
        .then(() => {
          console.log('Cultivo actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar cultivo:', err));
    } else {
      this.cultivoService.createCultivo(this.cultivo)
        .then(() => {
          console.log('Cultivo creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear cultivo:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/cultivo']);
  }
}
