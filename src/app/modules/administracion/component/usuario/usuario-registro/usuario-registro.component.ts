import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { UsuarioService } from '../../../service/Usuario.service';
import { UsuarioResponse } from '../../../models/Usuario-response.module';
import { UsuarioRequest } from '../../../models/Usuario-request.module';

@Component({
  selector: 'app-usuario-register',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.scss']
})
export class UsuarioRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Usuario: UsuarioResponse = new UsuarioResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  UsuarioEnvio: UsuarioRequest = new UsuarioRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _UsuarioService: UsuarioService,
  ) {
    this.myForm = this.fb.group({
      idUsuario: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      idColaborador: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Usuario);
  }

  guardar() {
    this.UsuarioEnvio = this.myForm.getRawValue();
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
    this._UsuarioService.create(this.UsuarioEnvio).subscribe({
      next: (data: UsuarioResponse) => {
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
    this._UsuarioService.update(this.UsuarioEnvio).subscribe({
      next: (data: UsuarioResponse) => {
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