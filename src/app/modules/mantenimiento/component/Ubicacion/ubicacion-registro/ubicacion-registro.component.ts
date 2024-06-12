import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { UbicacionService } from '../../../service/Ubicacion.service';
import { UbicacionResponse } from '../../../models/Ubicacion-response.module';
import { UbicacionRequest } from '../../../models/Ubicacion-request.module';

@Component({
  selector: 'app-ubicacion-register',
  templateUrl: './ubicacion-registro.component.html',
  styleUrls: ['./ubicacion-registro.component.scss']
})
export class UbicacionRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Ubicacion: UbicacionResponse = new UbicacionResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  UbicacionEnvio: UbicacionRequest = new UbicacionRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _UbicacionService: UbicacionService,
  ) {
    this.myForm = this.fb.group({
      idUbicacion: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      departamento: [null, [Validators.required]],
      provincia: [null, [Validators.required]],
      distrito: [null, [Validators.required]],
      centroPoblado: [null, []],
      nombreLugar: [null, []],
      gps: [null, []]
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Ubicacion);
  }

  guardar() {
    this.UbicacionEnvio = this.myForm.getRawValue();
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
    this._UbicacionService.create(this.UbicacionEnvio).subscribe({
      next: (data: UbicacionResponse) => {
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
    this._UbicacionService.update(this.UbicacionEnvio).subscribe({
      next: (data: UbicacionResponse) => {
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