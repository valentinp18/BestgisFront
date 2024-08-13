import { Component, OnInit } from '@angular/core';
import { CultivoService } from '../../../service/Cultivo.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-cultivo-lista',
  templateUrl: './cultivo-lista.component.html',
  styleUrls: ['./cultivo-lista.component.scss']
})

export class CultivoListaComponent implements OnInit {
  cultivos: any[] = [];
  cultivoIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private cultivoService: CultivoService) {}

  ngOnInit(): void {
    this.getCultivos();
  }

  getCultivos(): void {
    this.cultivoService.getCultivos().subscribe(data => {
      this.cultivos = data;
    });
  }

  openDeleteModal(id: string): void {
    this.cultivoIdToDelete = id;
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
    if (this.cultivoIdToDelete) {
      this.deleteCultivo(this.cultivoIdToDelete);
      this.cultivoIdToDelete = null;
      this.closeModal();  
    }
  }

  deleteCultivo(id: string): void {
    this.cultivoService.deleteCultivo(id)
      .then(() => console.log('Cultivo eliminado'))
      .catch(err => console.log(err));
  }
}
