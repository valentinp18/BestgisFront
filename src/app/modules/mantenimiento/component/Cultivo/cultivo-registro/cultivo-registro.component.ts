import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CultivoService } from '../../../service/Cultivo.service';

interface Cultivo {
  id?: string;
  nombre: string;
  descripcion: string;
  etapas: string[];
  tipo: string;
}

@Component({
  selector: 'app-cultivo-registro',
  templateUrl: './cultivo-registro.component.html',
  styleUrls: ['./cultivo-registro.component.scss']
})
export class CultivoRegistroComponent implements OnInit {
  cultivo: Cultivo = { nombre: '', descripcion: '', etapas: [], tipo: '' };
  id: string | null = null;
  nuevaEtapa: string = '';

  constructor(
    private cultivoService: CultivoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.cultivoService.getCultivo(this.id).subscribe(data => {
        let cultivoTemp: any = data;
        if (!cultivoTemp.etapas && cultivoTemp.etapa) {
          cultivoTemp.etapas = [cultivoTemp.etapa];
          delete cultivoTemp.etapa;
        }
        this.cultivo = cultivoTemp as Cultivo;
      });
    }
  }

  agregarEtapa(): void {
    if (this.nuevaEtapa.trim()) {
      this.cultivo.etapas.push(this.nuevaEtapa.trim());
      this.nuevaEtapa = '';
    }
  }

  eliminarEtapa(index: number): void {
    this.cultivo.etapas.splice(index, 1);
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