import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { RolService } from '../../../service/Rol.service';
import { RolResponse } from '../../../models/Rol-response.module';
import { RolRequest } from '../../../models/Rol-request.module';

@Component({
  selector: 'app-rol-register',
  templateUrl: './rol-registro.component.html',
  styleUrls: ['./rol-registro.component.scss']
})
export class RolRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Rol: RolResponse = new RolResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  RolEnvio: RolRequest = new RolRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _RolService: RolService,
  ) {
    this.myForm = this.fb.group({
      idRol: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      descripcion: [null, [Validators.required]],
      funcion: [null, []],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Rol);
  }

  guardar() {
    this.RolEnvio = this.myForm.getRawValue();
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
    this._RolService.create(this.RolEnvio).subscribe({
      next: (data: RolResponse) => {
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
    this._RolService.update(this.RolEnvio).subscribe({
      next: (data: RolResponse) => {
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