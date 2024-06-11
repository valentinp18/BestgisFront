import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { DroneService } from '../../../service/Drone.service';
import { DroneResponse } from '../../../models/Drone-response.module';
import { DroneRequest } from '../../../models/Drone-request.module';

@Component({
  selector: 'app-drone-register',
  templateUrl: './drone-registro.component.html',
  styleUrls: ['./drone-registro.component.scss']
})
export class DroneRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Drone: DroneResponse = new DroneResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  DroneEnvio: DroneRequest = new DroneRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _DroneService: DroneService,
  ) {
    this.myForm = this.fb.group({
      idDrone: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      modelo: [null, [Validators.required]],
      tipo: [null, []],
      capacidad: [null, []],
      descripcion: [null, []],
      mantenimiento: [null, []]
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Drone);
  }

  guardar() {
    this.DroneEnvio = this.myForm.getRawValue();
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
    this._DroneService.create(this.DroneEnvio).subscribe({
      next: (data: DroneResponse) => {
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
    this._DroneService.update(this.DroneEnvio).subscribe({
      next: (data: DroneResponse) => {
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