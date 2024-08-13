import { Component, OnInit } from '@angular/core';
import { UbicacionService } from '../../../service/Ubicacion.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-ubicacion-lista',
  templateUrl: './ubicacion-lista.component.html',
  styleUrls: ['./ubicacion-lista.component.scss']
})
export class UbicacionListaComponent implements OnInit {
  ubicaciones: any[] = [];
  ubicacionIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private ubicacionService: UbicacionService) {}

  ngOnInit(): void {
    this.getUbicaciones();
  }

  getUbicaciones(): void {
    this.ubicacionService.getUbicaciones().subscribe(data => {
      this.ubicaciones = data;
    });
  }

  openDeleteModal(id: string): void {
    this.ubicacionIdToDelete = id;
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
    if (this.ubicacionIdToDelete) {
      this.deleteUbicacion(this.ubicacionIdToDelete);
      this.ubicacionIdToDelete = null;
      this.closeModal();
    }
  }

  deleteUbicacion(id: string): void {
    this.ubicacionService.deleteUbicacion(id)
      .then(() => console.log('Ubicación eliminada'))
      .catch(err => console.log(err));
  }
}
