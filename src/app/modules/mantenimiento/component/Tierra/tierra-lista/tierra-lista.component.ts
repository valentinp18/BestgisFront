import { Component, OnInit } from '@angular/core';
import { TierraService } from '../../../service/Tierra.service';

@Component({
  selector: 'app-tierra-lista',
  templateUrl: './tierra-lista.component.html',
  styleUrls: ['./tierra-lista.component.scss']
})
export class TierraListaComponent implements OnInit {
  tierras: any[] = [];

  constructor(private tierraService: TierraService) {}

  ngOnInit(): void {
    this.getTierras();
  }

  getTierras(): void {
    this.tierraService.getTierras().subscribe(data => {
      this.tierras = data;
    });
  }

  deleteTierra(id: string): void {
    this.tierraService.deleteTierra(id)
      .then(() => console.log('Tierra eliminada'))
      .catch(err => console.log(err));
  }
}