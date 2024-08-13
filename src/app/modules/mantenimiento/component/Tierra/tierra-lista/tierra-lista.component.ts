import { Component, OnInit } from '@angular/core';
import { TierraService } from '../../../service/Tierra.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-tierra-lista',
  templateUrl: './tierra-lista.component.html',
  styleUrls: ['./tierra-lista.component.scss']
})
export class TierraListaComponent implements OnInit {
  tierras: any[] = [];
  tierraIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private tierraService: TierraService) {}

  ngOnInit(): void {
    this.getTierras();
  }

  getTierras(): void {
    this.tierraService.getTierras().subscribe(data => {
      this.tierras = data;
    });
  }

  openDeleteModal(id: string): void {
    this.tierraIdToDelete = id;
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
    if (this.tierraIdToDelete) {
      this.deleteTierra(this.tierraIdToDelete);
      this.tierraIdToDelete = null;
      this.closeModal();
    }
  }

  deleteTierra(id: string): void {
    this.tierraService.deleteTierra(id)
      .then(() => console.log('Tierra eliminada'))
      .catch(err => console.log(err));
  }
}
