import { Component, OnInit } from '@angular/core';
import { CultivoService } from '../../../service/Cultivo.service';

@Component({
  selector: 'app-cultivo-lista',
  templateUrl: './cultivo-lista.component.html',
  styleUrls: ['./cultivo-lista.component.scss']
})

export class CultivoListaComponent implements OnInit {
  cultivos: any[] = [];

  constructor(private cultivoService: CultivoService) {}

  ngOnInit(): void {
    this.getCultivos();
  }

  getCultivos(): void {
    this.cultivoService.getCultivos().subscribe(data => {
      this.cultivos = data;
    });
  }

  deleteCultivo(id: string): void {
    this.cultivoService.deleteCultivo(id)
      .then(() => console.log('Cultivo eliminado'))
      .catch(err => console.log(err));
  }
}
