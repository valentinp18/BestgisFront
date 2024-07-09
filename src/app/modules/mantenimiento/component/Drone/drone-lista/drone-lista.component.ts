import { Component, OnInit } from '@angular/core';
import { DroneService } from '../../../service/Drone.service';

@Component({
  selector: 'app-drone-lista',
  templateUrl: './drone-lista.component.html',
  styleUrls: ['./drone-lista.component.scss']
})
export class DroneListaComponent implements OnInit {
  drones: any[] = [];

  constructor(private droneService: DroneService) {}

  ngOnInit(): void {
    this.getDrones();
  }

  getDrones(): void {
    this.droneService.getDrones().subscribe(data => {
      this.drones = data;
    });
  }

  deleteDrone(id: string): void {
    this.droneService.deleteDrone(id)
      .then(() => console.log('Drone eliminado'))
      .catch(err => console.log(err));
  }
}
