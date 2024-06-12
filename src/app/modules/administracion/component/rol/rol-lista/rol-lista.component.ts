import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { RolService } from '../../../service/Rol.service';
import { RolResponse } from '../../../models/Rol-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-lista.component.html',
  styleUrls: ['./rol-lista.component.scss']
})
export class RolListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Rols: RolResponse[] = [];
  RolSelected: RolResponse = new RolResponse();
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
    private _RolService: RolService,
  ) {
    this.myFormFilter = this.fb.group({
      idRol: ["", []],
      descripcion: ["", []],
      funcion: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarRols();
  }

  listarRols() {
    this._RolService.getAll().subscribe({
      next: (data: RolResponse[]) => {
        this.Rols = data;
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

  crearRol(template: TemplateRef<any>) {
    this.RolSelected = new RolResponse();
    this.titleModal = "NUEVO ROL";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarRol(template: TemplateRef<any>, Rol: RolResponse) {
    this.RolSelected = Rol;
    this.titleModal = "EDITAR ROL";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarRols();
    }
  }

  eliminarRegistro(idRol: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._RolService.delete(idRol).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarRols();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idRol", value: valueForm.idRol },
      { name: "descripcion", value: valueForm.descripcion },
      { name: "funcion", value: valueForm.funcion }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._RolService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<RolResponse>) => {
        this.Rols = data.lista;
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
