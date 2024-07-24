// seguimiento.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MisionService } from '../../../service/Mision.service';
import { Seguimiento } from '../../../service/Seguimiento.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent implements OnInit {
  misionId!: string;
  seguimientos: Seguimiento[] = [];

  constructor(
    private route: ActivatedRoute,
    private misionService: MisionService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.misionId = id;
      this.loadSeguimientos();
    } else {
      console.error('No se proporcionó ID de misión');
    }
  }
  loadSeguimientos(): void {
    this.misionService.getSeguimientosMision(this.misionId).subscribe(
      seguimientos => this.seguimientos = seguimientos,
      error => console.error('Error al cargar seguimientos:', error)
    );
  }

  actualizarSeguimiento(seguimiento: Seguimiento): void {
    if (seguimiento.id) {
      this.misionService.actualizarSeguimientoMision(seguimiento).subscribe(
        () => console.log('Seguimiento actualizado'),
        error => console.error('Error al actualizar seguimiento:', error)
      );
    } else {
      console.error('Intento de actualizar un seguimiento sin ID');
    }
  }
}