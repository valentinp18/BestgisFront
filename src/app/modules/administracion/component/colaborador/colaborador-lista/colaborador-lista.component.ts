import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../../service/Colaborador.service';

@Component({
  selector: 'app-colaborador-lista',
  templateUrl: './colaborador-lista.component.html',
  styleUrls: ['./colaborador-lista.component.scss']
})
export class ColaboradorListaComponent implements OnInit {
  colaboradores: any[] = [];

  constructor(private colaboradorService: ColaboradorService) {}

  ngOnInit(): void {
    this.getColaboradores();
  }

  getColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(data => {
      this.colaboradores = data;
    });
  }

  deleteColaborador(id: string): void {
    this.colaboradorService.deleteColaborador(id)
      .then(() => console.log('Colaborador eliminado'))
      .catch(err => console.log(err));
  }
}