import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CultivoService } from '../../../service/Cultivo.service';
import { CultivoResponse } from '../../../models/Cultivo-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-cultivo-list',
  templateUrl: './cultivo-lista.component.html',
  styleUrls: ['./cultivo-lista.component.scss']
})
export class CultivoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Cultivos: CultivoResponse[] = [];
  CultivoSelected: CultivoResponse = new CultivoResponse();
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
    private _CultivoService: CultivoService,
  ) {
    this.myFormFilter = this.fb.group({
      idCultivo: ["", []],
      nombre: ["", []],
      tipo: ["", []],
      condicion: ["", []],
      descripcion: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarCultivos();
  }

  listarCultivos() {
    this._CultivoService.getAll().subscribe({
      next: (data: CultivoResponse[]) => {
        this.Cultivos = data;
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

  crearCultivo(template: TemplateRef<any>) {
    this.CultivoSelected = new CultivoResponse();
    this.titleModal = "NUEVO CULTIVO";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarCultivo(template: TemplateRef<any>, Cultivo: CultivoResponse) {
    this.CultivoSelected = Cultivo;
    this.titleModal = "EDITAR CULTIVO";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarCultivos();
    }
  }

  eliminarRegistro(idCultivo: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._CultivoService.delete(idCultivo).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarCultivos();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idCultivo", value: valueForm.idCultivo },
      { name: "nombre", value: valueForm.nombre },
      { name: "tipo", value: valueForm.tipo },
      { name: "condicion", value: valueForm.condicion },
      { name: "descripcion", value: valueForm.descripcion }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._CultivoService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<CultivoResponse>) => {
        this.Cultivos = data.lista;
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
