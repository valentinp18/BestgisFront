import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { CultivoService } from '../../../service/Cultivo.service';
import { CultivoResponse } from '../../../models/Cultivo-response.module';
import { CultivoRequest } from '../../../models/Cultivo-request.module';

@Component({
  selector: 'app-cultivo-register',
  templateUrl: './cultivo-registro.component.html',
  styleUrls: ['./cultivo-registro.component.scss']
})
export class CultivoRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Cultivo: CultivoResponse = new CultivoResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  CultivoEnvio: CultivoRequest = new CultivoRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _CultivoService: CultivoService,
  ) {
    this.myForm = this.fb.group({
      idCultivo: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      nombre: [null, [Validators.required]],
      tipo: [null, []],
      condicion: [null, []],
      descripcion: [null, []]
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Cultivo);
  }

  guardar() {
    this.CultivoEnvio = this.myForm.getRawValue();
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
    this._CultivoService.create(this.CultivoEnvio).subscribe({
      next: (data: CultivoResponse) => {
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
    this._CultivoService.update(this.CultivoEnvio).subscribe({
      next: (data: CultivoResponse) => {
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