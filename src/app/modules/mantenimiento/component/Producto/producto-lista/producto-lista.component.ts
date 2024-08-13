import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/Producto.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.scss']
})
export class ProductoListaComponent implements OnInit {
  productos: any[] = [];
  productoIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  openDeleteModal(id: string): void {
    this.productoIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      this.deleteModal = new Modal(modalElement);
      this.deleteModal.show();
    }
  }

  closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
  }

  confirmDelete(): void {
    if (this.productoIdToDelete) {
      this.deleteProducto(this.productoIdToDelete);
      this.productoIdToDelete = null;
      this.closeModal();
    }
  }

  deleteProducto(id: string): void {
    this.productoService.deleteProducto(id)
      .then(() => console.log('Producto eliminado'))
      .catch(err => console.log(err));
  }
}
