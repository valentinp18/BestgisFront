import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/Producto.service';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.scss']
})
export class ProductoListaComponent implements OnInit {
  productos: any[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  deleteProducto(id: string): void {
    this.productoService.deleteProducto(id)
      .then(() => console.log('Producto eliminado'))
      .catch(err => console.log(err));
  }
}
