import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UbicacionService } from '../../../service/Ubicacion.service';
import { UbicacionResponse } from '../../../models/Ubicacion-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-ubicacion-list',
  templateUrl: './ubicacion-lista.component.html',
  styleUrls: ['./ubicacion-lista.component.scss']
})
export class UbicacionListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Ubicacions: UbicacionResponse[] = [];
  UbicacionSelected: UbicacionResponse = new UbicacionResponse();
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
    private _UbicacionService: UbicacionService,
  ) {
    this.myFormFilter = this.fb.group({
      idUbicacion: ["", []],
      departamento: ["", []],
      provincia: ["", []],
      distrito: ["", []],
      centroPoblado: ["", []],
      nombreLugar: ["", []],
      gps: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarUbicacions();
  }

  listarUbicacions() {
    this._UbicacionService.getAll().subscribe({
      next: (data: UbicacionResponse[]) => {
        this.Ubicacions = data;
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

  crearUbicacion(template: TemplateRef<any>) {
    this.UbicacionSelected = new UbicacionResponse();
    this.titleModal = "NUEVO UBICACIÓN";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarUbicacion(template: TemplateRef<any>, Ubicacion: UbicacionResponse) {
    this.UbicacionSelected = Ubicacion;
    this.titleModal = "EDITAR UBICACIÓN";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarUbicacions();
    }
  }

  eliminarRegistro(idUbicacion: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._UbicacionService.delete(idUbicacion).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarUbicacions();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idUbicacion", value: valueForm.idUbicacion },
      { name: "departamento", value: valueForm.departamento },
      { name: "provincia", value: valueForm.provincia },
      { name: "distrito", value: valueForm.distrito },
      { name: "centroPoblado", value: valueForm.centroPoblado },
      { name: "nombreLugar", value: valueForm.nombreLugar },
      { name: "gps", value: valueForm.gps }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._UbicacionService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<UbicacionResponse>) => {
        this.Ubicacions = data.lista;
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
