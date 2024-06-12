import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DroneService } from '../../../service/Drone.service';
import { DroneResponse } from '../../../models/Drone-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-drone-list',
  templateUrl: './drone-lista.component.html',
  styleUrls: ['./drone-lista.component.scss']
})
export class DroneListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Drones: DroneResponse[] = [];
  DroneSelected: DroneResponse = new DroneResponse();
  titleModal: string = "";
  accionModal: number = 0;
  myFormFilter: FormGroup;
  totalItems: number = 0;
  itemsPerPage: number = 3;
  request: GenericFilterRequest = new GenericFilterRequest();

  constructor(
    private _route: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private _DroneService: DroneService,
  ) {
    this.myFormFilter = this.fb.group({
      idDrone: ["", []],
      modelo: ["", []],
      tipo: ["", []],
      capacidad: ["", []],
      descripcion: ["", []],
      mantenimiento: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarDrones();
  }

  listarDrones() {
    this._DroneService.getAll().subscribe({
      next: (data: DroneResponse[]) => {
        this.Drones = data;
        this.totalItems = data.length;
      },
      error: (err) => {
        console.log("error ", err);
      },
      complete: () => {
        console.log();
      },
    });
  }

  crearDrone(template: TemplateRef<any>) {
    this.DroneSelected = new DroneResponse();
    this.titleModal = "NUEVO DRONE";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarDrone(template: TemplateRef<any>, Drone: DroneResponse) {
    this.DroneSelected = Drone;
    this.titleModal = "EDITAR DRONE";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarDrones();
    }
  }

  eliminarRegistro(idDrone: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._DroneService.delete(idDrone).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarDrones();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idDrone", value: valueForm.idDrone },
      { name: "modelo", value: valueForm.modelo },
      { name: "tipo", value: valueForm.tipo },
      { name: "capacidad", value: valueForm.capacidad },
      { name: "descripcion", value: valueForm.descripcion },
      { name: "mantimiento", value: valueForm.mantenimiento }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._DroneService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<DroneResponse>) => {
        this.Drones = data.lista;
        this.totalItems = data.totalRegistros;
      },
      error: () => {
        console.log("error");
      },
      complete: () => {
        console.log("completo");
      },
    });
  }

  changePage(event: PageChangedEvent) {
    this.request.numeroPagina = event.page;
    this.filtrar();
  }

  changeItemsPerPage() {
    this.request.cantidad = this.itemsPerPage;
    this.filtrar();
  }
}
