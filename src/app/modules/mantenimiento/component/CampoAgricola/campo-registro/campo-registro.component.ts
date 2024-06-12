import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { CampoAgricolaService } from '../../../service/CampoAgricola.service';
import { CampoAgricolaResponse } from '../../../models/CampoAgricola-response.module';
import { CampoAgricolaRequest } from '../../../models/CampoAgricola-request.module';

@Component({
  selector: 'app-campo-register',
  templateUrl: './campo-registro.component.html',
  styleUrls: ['./campo-registro.component.scss']
})
export class CampoAgricolaRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() CampoAgricola: CampoAgricolaResponse = new CampoAgricolaResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  CampoAgricolaEnvio: CampoAgricolaRequest = new CampoAgricolaRequest();
  myForm: FormGroup;
  ubicaciones: any[] = []; // Variable para almacenar ubicaciones

  constructor(
    private fb: FormBuilder,
    private _CampoAgricolaService: CampoAgricolaService,
  ) {
    this.myForm = this.fb.group({
      idCampo: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      tamano: [null, []],
      tipoTierra: [null, []],
      ubicacion: [null, [Validators.required]], // Campo de ubicación
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.CampoAgricola);
    this.cargarUbicaciones();
  }

  cargarUbicaciones() {
    this._CampoAgricolaService.getUbicaciones().subscribe({
      next: (data: any[]) => {
        this.ubicaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar ubicaciones', err);
      }
    });
  }

  guardar() {
    this.CampoAgricolaEnvio = this.myForm.getRawValue();
    switch (this.accion) {
      case AccionMantConst.crear:
        this.crearRegistro();
        break;
      case AccionMantConst.editar:
        this.editarRegistro();
        break;
    }
  }

  crearRegistro() {
    this._CampoAgricolaService.create(this.CampoAgricolaEnvio).subscribe({
      next: (data: CampoAgricolaResponse) => {
        alert("Creado de forma correcta");
      },
      error: () => {
        alert("Ocurrió un error");
      },
      complete: () => {
        this.cerrarModal(true);
      }
    });
  }

  editarRegistro() {
    this._CampoAgricolaService.update(this.CampoAgricolaEnvio).subscribe({
      next: (data: CampoAgricolaResponse) => {
        alert("Actualizado de forma correcta");
      },
      error: () => {
        alert("Ocurrió un error");
      },
      complete: () => {
        this.cerrarModal(true);
      }
    });
  }

  cerrarModal(res: boolean) {
    this.closeModalEmmit.emit(res);
  }
}
