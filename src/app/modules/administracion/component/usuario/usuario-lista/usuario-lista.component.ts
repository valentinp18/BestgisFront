import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../service/Usuario.service';
import { UsuarioResponse } from '../../../models/Usuario-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.scss']
})
export class UsuarioListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Usuarios: UsuarioResponse[] = [];
  UsuarioSelected: UsuarioResponse = new UsuarioResponse();
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
    private _UsuarioService: UsuarioService,
  ) {
    this.myFormFilter = this.fb.group({
      idUsuario: ["", []],
      username: ["", []],
      password: ["", []],
      idColaborador: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this._UsuarioService.getAll().subscribe({
      next: (data: UsuarioResponse[]) => {
        this.Usuarios = data;
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

  crearUsuario(template: TemplateRef<any>) {
    this.UsuarioSelected = new UsuarioResponse();
    this.titleModal = "NUEVO USUARIO";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarUsuario(template: TemplateRef<any>, Usuario: UsuarioResponse) {
    this.UsuarioSelected = Usuario;
    this.titleModal = "EDITAR USUARIO";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarUsuarios();
    }
  }

  eliminarRegistro(idUsuario: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._UsuarioService.delete(idUsuario).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarUsuarios();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idUsuario", value: valueForm.idUsuario },
      { name: "username", value: valueForm.username },
      { name: "password", value: valueForm.password },
      { name: "idColaborador", value: valueForm.idColaborador }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._UsuarioService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<UsuarioResponse>) => {
        this.Usuarios = data.lista;
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
