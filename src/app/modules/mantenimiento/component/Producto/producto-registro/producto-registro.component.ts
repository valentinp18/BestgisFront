import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../service/Producto.service';

@Component({
  selector: 'app-producto-registro',
  templateUrl: './producto-registro.component.html',
  styleUrls: ['./producto-registro.component.scss']
})
export class ProductoRegistroComponent implements OnInit {
  producto: any = { nombre: '', tipo: '', descripcion: '' };
  id: string | null = null;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productoService.getProducto(this.id).subscribe(data => {
        this.producto = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.productoService.updateProducto(this.id, this.producto)
        .then(() => {
          console.log('Producto actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar producto:', err));
    } else {
      this.productoService.createProducto(this.producto)
        .then(() => {
          console.log('Producto creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear producto:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/producto']);
  }
}
