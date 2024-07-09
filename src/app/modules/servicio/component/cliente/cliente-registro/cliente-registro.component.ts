import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../service/Cliente.service';

@Component({
  selector: 'app-cliente-registro',
  templateUrl: './cliente-registro.component.html',
  styleUrls: ['./cliente-registro.component.scss']
})
export class ClienteRegistroComponent implements OnInit {
  cliente: any = {
    nombre: '',
    apellido: '',
    tipo_documento: '',
    numero_documento: '',
    sexo: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: ''
  };
  id: string | null = null;
  isLoading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadCliente(this.id);
    }
  }

  loadCliente(id: string): void {
    this.isLoading = true;
    this.clienteService.getCliente(id).subscribe(
      data => {
        this.cliente = data;
        if (this.cliente.fecha_nacimiento) {
          this.cliente.fecha_nacimiento = this.convertirFechaParaInput(this.cliente.fecha_nacimiento);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el cliente:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.cliente.fecha_nacimiento) {
      this.cliente.fecha_nacimiento = this.convertirFechaParaFirestore(this.cliente.fecha_nacimiento);
    }

    if (this.id) {
      this.clienteService.updateCliente(this.id, this.cliente)
        .then(() => {
          console.log('Cliente actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar cliente:', err));
    } else {
      this.clienteService.createCliente(this.cliente)
        .then(() => {
          console.log('Cliente creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear cliente:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/servicio/cliente']);
  }

  convertirFechaParaInput(fechaString: string): string {
    const [dia, mes, anio] = fechaString.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  convertirFechaParaFirestore(fechaInput: string): string {
    const [anio, mes, dia] = fechaInput.split('-');
    return `${dia}/${mes}/${anio}`;
  }
}