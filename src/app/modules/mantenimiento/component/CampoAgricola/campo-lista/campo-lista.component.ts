import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampoAgricolaService } from '../../../service/CampoAgricola.service';
import { CampoAgricolaResponse } from '../../../models/CampoAgricola-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-campo-list',
  templateUrl: './campo-lista.component.html',
  styleUrls: ['./campo-lista.component.scss']
})
export class CampoAgricolaListaComponent implements OnInit {
  modalRef?: BsModalRef;
  CampoAgricolas: CampoAgricolaResponse[] = [];
  CampoAgricolaSelected: CampoAgricolaResponse = new CampoAgricolaResponse();
  titleModal: string = "";
  accionModal: number = 0;
  myFormFilter: FormGroup;
  totalItems: number = 0;
  itemsPerPage: number = 3;
  request: GenericFilterRequest = new GenericFilterRequest();
  ubicaciones: any[] = [];

  constructor(
    private _route: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private _CampoAgricolaService: CampoAgricolaService,
  ) {
    this.myFormFilter = this.fb.group({
      idCampo: ["", []],
      tamano: ["", []],  // Cambiado de 'tamaño' a 'tamano'
      tipoTierra: ["", []],
      ubicacion: ["", []]
    });
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.listarCampoAgricolas();
  }

  cargarUbicaciones() {
    this._CampoAgricolaService.getUbicaciones().subscribe({
      next: (data: any[]) => {
        this.ubicaciones = data;
        this.listarCampoAgricolas();
      },
      error: (err) => {
        console.error('Error al cargar ubicaciones', err);
      }
    });
  }

  listarCampoAgricolas() {
    this._CampoAgricolaService.getAll().subscribe({
      next: (data: CampoAgricolaResponse[]) => {
        this.CampoAgricolas = data.map(campo => {
          campo.ubicacion = this.ubicaciones.find(ubic => ubic.id === campo.ubicacion)?.nombre || 'Desconocida';
          return campo;
        });
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

  crearCampoAgricola(template: TemplateRef<any>) {
    this.CampoAgricolaSelected = new CampoAgricolaResponse();
    this.titleModal = "NUEVO CAMPO AGRICOLA";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarCampoAgricola(template: TemplateRef<any>, CampoAgricola: CampoAgricolaResponse) {
    this.CampoAgricolaSelected = CampoAgricola;
    this.titleModal = "EDITAR CAMPO AGRICOLA";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarCampoAgricolas();
    }
  }

  eliminarRegistro(idCampoAgricola: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._CampoAgricolaService.delete(idCampoAgricola).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarCampoAgricolas();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idCampo", value: valueForm.idCampo },
      { name: "tamano", value: valueForm.tamano },  // Cambiado de 'tamaño' a 'tamano'
      { name: "tipoTierra", value: valueForm.tipoTierra },
      { name: "ubicacion", value: valueForm.ubicacion }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._CampoAgricolaService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<CampoAgricolaResponse>) => {
        this.CampoAgricolas = data.lista.map(campo => {
          campo.ubicacion = this.ubicaciones.find(ubic => ubic.id === campo.ubicacion)?.nombre || 'Desconocida';
          return campo;
        });
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
