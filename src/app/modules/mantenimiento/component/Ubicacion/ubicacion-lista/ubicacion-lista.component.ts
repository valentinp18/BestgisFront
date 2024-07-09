import { Component, OnInit } from '@angular/core';
import { UbicacionService } from '../../../service/Ubicacion.service';

@Component({
  selector: 'app-ubicacion-lista',
  templateUrl: './ubicacion-lista.component.html',
  styleUrls: ['./ubicacion-lista.component.scss']
})
export class UbicacionListaComponent implements OnInit {
  ubicaciones: any[] = [];

  constructor(private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.getUbicaciones();
  }

  getUbicaciones(): void {
    this.ubicacionService.getUbicaciones().subscribe(data => {
      this.ubicaciones = data;
    });
  }

  deleteUbicacion(id: string): void {
    this.ubicacionService.deleteUbicacion(id)
      .then(() => console.log('Ubicación eliminada'))
      .catch(err => console.log(err));
  }
}
