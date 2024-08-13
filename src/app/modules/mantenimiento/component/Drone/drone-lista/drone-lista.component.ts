import { Component, OnInit } from '@angular/core';
import { DroneService } from '../../../service/Drone.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-drone-lista',
  templateUrl: './drone-lista.component.html',
  styleUrls: ['./drone-lista.component.scss']
})
export class DroneListaComponent implements OnInit {
  drones: any[] = [];
  droneIdToDelete: string | null = null;
  deleteModal: Modal | null = null;

  constructor(private droneService: DroneService) {}

  ngOnInit(): void {
    this.getDrones();
  }

  getDrones(): void {
    this.droneService.getDrones().subscribe(data => {
      this.drones = data;
    });
  }

  openDeleteModal(id: string): void {
    this.droneIdToDelete = id;
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
    if (this.droneIdToDelete) {
      this.deleteDrone(this.droneIdToDelete);
      this.droneIdToDelete = null;
      this.closeModal();
    }
  }

  deleteDrone(id: string): void {
    this.droneService.deleteDrone(id)
      .then(() => console.log('Drone eliminado'))
      .catch(err => console.log(err));
  }
}
