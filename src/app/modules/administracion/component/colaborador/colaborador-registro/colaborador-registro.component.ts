import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { ColaboradorService } from '../../../service/Colaborador.service';
import { ColaboradorResponse } from '../../../models/Colaborador-response.module';
import { ColaboradorRequest } from '../../../models/Colaborador-request.module';

@Component({
  selector: 'app-colaborador-register',
  templateUrl: './colaborador-registro.component.html',
  styleUrls: ['./colaborador-registro.component.scss']
})
export class ColaboradorRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Colaborador: ColaboradorResponse = new ColaboradorResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  ColaboradorEnvio: ColaboradorRequest = new ColaboradorRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _ColaboradorService: ColaboradorService,
  ) {
    this.myForm = this.fb.group({
      idColaborador: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      idPersona: [null, [Validators.required]],
      idRol: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Colaborador);
  }

  guardar() {
    this.ColaboradorEnvio = this.myForm.getRawValue();
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
    this._ColaboradorService.create(this.ColaboradorEnvio).subscribe({
      next: (data: ColaboradorResponse) => {
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
    this._ColaboradorService.update(this.ColaboradorEnvio).subscribe({
      next: (data: ColaboradorResponse) => {
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