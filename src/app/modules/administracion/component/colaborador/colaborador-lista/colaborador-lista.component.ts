import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColaboradorService } from '../../../service/Colaborador.service';
import { ColaboradorResponse } from '../../../models/Colaborador-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-colaborador-list',
  templateUrl: './colaborador-lista.component.html',
  styleUrls: ['./colaborador-lista.component.scss']
})
export class ColaboradorListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Colaboradors: ColaboradorResponse[] = [];
  ColaboradorSelected: ColaboradorResponse = new ColaboradorResponse();
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
    private _ColaboradorService: ColaboradorService,
  ) {
    this.myFormFilter = this.fb.group({
      idColaborador: ["", []],
      idPersona: ["", []],
      idRol: ["", []],
    });
  }

  ngOnInit(): void {
    this.listarColaboradors();
  }

  listarColaboradors() {
    this._ColaboradorService.getAll().subscribe({
      next: (data: ColaboradorResponse[]) => {
        this.Colaboradors = data;
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

  crearColaborador(template: TemplateRef<any>) {
    this.ColaboradorSelected = new ColaboradorResponse();
    this.titleModal = "NUEVO COLABORADOR";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarColaborador(template: TemplateRef<any>, Colaborador: ColaboradorResponse) {
    this.ColaboradorSelected = Colaborador;
    this.titleModal = "EDITAR COLABORADOR";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarColaboradors();
    }
  }

  eliminarRegistro(idColaborador: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._ColaboradorService.delete(idColaborador).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarColaboradors();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idColaborador", value: valueForm.idColaborador },
      { name: "idPersona", value: valueForm.idPersona },
      { name: "idRol", value: valueForm.idRol },
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._ColaboradorService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<ColaboradorResponse>) => {
        this.Colaboradors = data.lista;
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
