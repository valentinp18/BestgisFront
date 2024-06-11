import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClimaService } from '../../../service/Clima.service';
import { ClimaResponse } from '../../../models/Clima-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-clima-list',
  templateUrl: './clima-lista.component.html',
  styleUrls: ['./clima-lista.component.scss']
})
export class ClimaListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Climas: ClimaResponse[] = [];
  ClimaSelected: ClimaResponse = new ClimaResponse();
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
    private _ClimaService: ClimaService,
  ) {
    this.myFormFilter = this.fb.group({
      idClima: ["", []],
      estado: ["", []],
      observacion: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarClimas();
  }

  listarClimas() {
    this._ClimaService.getAll().subscribe({
      next: (data: ClimaResponse[]) => {
        this.Climas = data;
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

  crearClima(template: TemplateRef<any>) {
    this.ClimaSelected = new ClimaResponse();
    this.titleModal = "NUEVO CLIMA";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarClima(template: TemplateRef<any>, Clima: ClimaResponse) {
    this.ClimaSelected = Clima;
    this.titleModal = "EDITAR CLIMA";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarClimas();
    }
  }

  eliminarRegistro(idClima: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._ClimaService.delete(idClima).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarClimas();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idClima", value: valueForm.idClima },
      { name: "estado", value: valueForm.estado },
      { name: "observacion", value: valueForm.observacion }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._ClimaService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<ClimaResponse>) => {
        this.Climas = data.lista;
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
