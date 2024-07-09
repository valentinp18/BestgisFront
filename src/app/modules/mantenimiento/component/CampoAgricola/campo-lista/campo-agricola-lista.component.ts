import { Component, OnInit } from '@angular/core';
import { CampoAgricolaService } from '../../../service/CampoAgricola.service';

@Component({
  selector: 'app-campo-agricola-lista',
  templateUrl: './campo-agricola-lista.component.html',
  styleUrls: ['./campo-agricola-lista.component.scss']
})
export class CampoAgricolaListaComponent implements OnInit {
  camposAgricolas: any[] = [];

  constructor(private campoAgricolaService: CampoAgricolaService) {}

  ngOnInit(): void {
    this.getCamposAgricolas();
  }

  getCamposAgricolas(): void {
    this.campoAgricolaService.getCamposAgricolas().subscribe(data => {
      this.camposAgricolas = data;
    });
  }

  deleteCampoAgricola(id: string): void {
    this.campoAgricolaService.deleteCampoAgricola(id)
      .then(() => console.log('Campo agrícola eliminado'))
      .catch(err => console.log(err));
  }
}