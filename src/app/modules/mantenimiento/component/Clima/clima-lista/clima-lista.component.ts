import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../../../service/Clima.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-clima-lista',
  templateUrl: './clima-lista.component.html',
  styleUrls: ['./clima-lista.component.scss']
})
export class ClimaListaComponent implements OnInit {
  climas: any[] = [];
  climaIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    this.getClimas();
  }

  getClimas(): void {
    this.climaService.getClimas().subscribe(data => {
      this.climas = data;
    });
  }

  openDeleteModal(id: string): void {
    this.climaIdToDelete = id;
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
    if (this.climaIdToDelete) {
      this.deleteClima(this.climaIdToDelete);
      this.climaIdToDelete = null;
      this.closeModal();  
    }
  }

  deleteClima(id: string): void {
    this.climaService.deleteClima(id)
      .then(() => console.log('Clima eliminado'))
      .catch(err => console.log(err));
  }
}
