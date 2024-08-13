import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/Cliente.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.scss']
})
export class ClienteListaComponent implements OnInit {
  clientes: any[] = [];
  clienteIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  openDeleteModal(id: string): void {
    this.clienteIdToDelete = id;
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
    if (this.clienteIdToDelete) {
      this.deleteCliente(this.clienteIdToDelete);
      this.clienteIdToDelete = null;
      this.closeModal();
    }
  }

  deleteCliente(id: string): void {
    this.clienteService.deleteCliente(id)
      .then(() => console.log('Cliente eliminado'))
      .catch(err => console.log(err));
  }
}
