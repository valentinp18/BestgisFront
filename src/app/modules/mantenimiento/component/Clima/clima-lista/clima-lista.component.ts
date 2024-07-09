import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../../../service/Clima.service';

@Component({
  selector: 'app-clima-lista',
  templateUrl: './clima-lista.component.html',
  styleUrls: ['./clima-lista.component.scss']
})

export class ClimaListaComponent implements OnInit {
  climas: any[] = [];

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    this.getClimas();
  }

  getClimas(): void {
    this.climaService.getClimas().subscribe(data => {
      this.climas = data;
    });
  }

  deleteClima(id: string): void {
    this.climaService.deleteClima(id)
      .then(() => console.log('Clima eliminado'))
      .catch(err => console.log(err));
  }
}