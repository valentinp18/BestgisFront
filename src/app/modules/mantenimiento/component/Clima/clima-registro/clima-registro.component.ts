import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { ClimaService } from '../../../service/Clima.service';
import { ClimaResponse } from '../../../models/Clima-response.module';
import { ClimaRequest } from '../../../models/Clima-request.module';

@Component({
  selector: 'app-clima-register',
  templateUrl: './clima-registro.component.html',
  styleUrls: ['./clima-registro.component.scss']
})
export class ClimaRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() clima: ClimaResponse = new ClimaResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  climaEnvio: ClimaRequest = new ClimaRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _climaService: ClimaService,
  ) {
    this.myForm = this.fb.group({
      idClima: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      estado: [null, [Validators.required]],
      observacion: [null, []],
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.clima);
  }

  guardar() {
    this.climaEnvio = this.myForm.getRawValue();
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
    this._climaService.create(this.climaEnvio).subscribe({
      next: (data: ClimaResponse) => {
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
    this._climaService.update(this.climaEnvio).subscribe({
      next: (data: ClimaResponse) => {
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