import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../service/Producto.service';
import { ProductoResponse } from '../../../models/Producto-response.module';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericFilterRequest } from '../../../../../models/generic-filter-request.model';
import { GenericFilterResponse } from '../../../../../models/generic-filter-response.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.scss']
})
export class ProductoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  Productos: ProductoResponse[] = [];
  ProductoSelected: ProductoResponse = new ProductoResponse();
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
    private _ProductoService: ProductoService,
  ) {
    this.myFormFilter = this.fb.group({
      idProducto: ["", []],
      nombre: ["", []],
      tipo: ["", []],
      descripcion: ["", []]
    });
  }

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos() {
    this._ProductoService.getAll().subscribe({
      next: (data: ProductoResponse[]) => {
        this.Productos = data;
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

  crearProducto(template: TemplateRef<any>) {
    this.ProductoSelected = new ProductoResponse();
    this.titleModal = "NUEVO PRODUCTO";
    this.accionModal = AccionMantConst.crear;
    this.openModal(template);
  }

  editarProducto(template: TemplateRef<any>, Producto: ProductoResponse) {
    this.ProductoSelected = Producto;
    this.titleModal = "EDITAR PRODUCTO";
    this.accionModal = AccionMantConst.editar;
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getCloseModalEmmit(res: boolean) {
    this.modalRef?.hide();
    if (res) {
      this.listarProductos();
    }
  }

  eliminarRegistro(idProducto: number) {
    let result = confirm("¿Está seguro de eliminar el registro?");

    if (result) {
      this._ProductoService.delete(idProducto).subscribe({
        next: (data: number) => {
          alert("Registro eliminado de forma correcta");
        },
        error: () => { },
        complete: () => {
          this.listarProductos();
        }
      });
    }
  }

  filtrar() {
    let valueForm = this.myFormFilter.getRawValue();
    this.request.filtros = [
      { name: "idProducto", value: valueForm.idProducto },
      { name: "nombre", value: valueForm.nombre },
      { name: "tipo", value: valueForm.tipo },
      { name: "descripcion", value: valueForm.descripcion }
    ];
    this.request.numeroPagina = 1; 
    this.request.cantidad = this.itemsPerPage;

    this._ProductoService.genericFilter(this.request).subscribe({
      next: (data: GenericFilterResponse<ProductoResponse>) => {
        this.Productos = data.lista;
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
