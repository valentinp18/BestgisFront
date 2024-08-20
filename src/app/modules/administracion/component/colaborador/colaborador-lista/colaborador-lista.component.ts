import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../../service/Colaborador.service';

@Component({
  selector: 'app-colaborador-lista',
  templateUrl: './colaborador-lista.component.html',
  styleUrls: ['./colaborador-lista.component.scss']
})
export class ColaboradorListaComponent implements OnInit {
  colaboradores: any[] = [];
  colaboradorAEliminar: any = null;

  constructor(private colaboradorService: ColaboradorService) {}

  ngOnInit(): void {
    this.getColaboradores();
  }

  getColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(data => {
      this.colaboradores = data;
    });
  }

  confirmarEliminacion(colaborador: any): void {
    this.colaboradorAEliminar = colaborador;
  }

  eliminarColaborador(): void {
    if (this.colaboradorAEliminar) {
      this.colaboradorService.deleteColaborador(this.colaboradorAEliminar.id)
        .then(() => {
          console.log('Colaborador eliminado');
          this.getColaboradores();
          this.colaboradorAEliminar = null;
        })
        .catch(err => console.log(err));
    }
  }
}