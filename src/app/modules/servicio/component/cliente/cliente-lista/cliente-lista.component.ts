import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/Cliente.service';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.scss']
})
export class ClienteListaComponent implements OnInit {
  clientes: any[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  deleteCliente(id: string): void {
    this.clienteService.deleteCliente(id)
      .then(() => console.log('Cliente eliminado'))
      .catch(err => console.log(err));
  }
}