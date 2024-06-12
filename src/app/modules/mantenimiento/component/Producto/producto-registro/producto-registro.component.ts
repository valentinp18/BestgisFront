import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionMantConst } from '../../../../../constants/general.constants';
import { ProductoService } from '../../../service/Producto.service';
import { ProductoResponse } from '../../../models/Producto-response.module';
import { ProductoRequest } from '../../../models/Producto-request.module';

@Component({
  selector: 'app-Producto-register',
  templateUrl: './Producto-registro.component.html',
  styleUrls: ['./Producto-registro.component.scss']
})
export class ProductoRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Input() Producto: ProductoResponse = new ProductoResponse();
  @Input() accion: number = 0;

  @Output() closeModalEmmit = new EventEmitter<boolean>();

  ProductoEnvio: ProductoRequest = new ProductoRequest();
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _ProductoService: ProductoService,
  ) {
    this.myForm = this.fb.group({
      idProducto: [{ value: 0, disabled: this.accion === AccionMantConst.crear }, [Validators.required]],
      nombre: [null, []],
      tipo: [null, []],
      descripcion: [null, []]
    });
  }

  ngOnInit(): void {
    this.myForm.patchValue(this.Producto);
  }

  guardar() {
    this.ProductoEnvio = this.myForm.getRawValue();
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
    this._ProductoService.create(this.ProductoEnvio).subscribe({
      next: (data: ProductoResponse) => {
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
    this._ProductoService.update(this.ProductoEnvio).subscribe({
      next: (data: ProductoResponse) => {
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