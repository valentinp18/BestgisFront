import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DroneService } from '../../../service/Drone.service';

@Component({
  selector: 'app-drone-registro',
  templateUrl: './drone-registro.component.html',
  styleUrls: ['./drone-registro.component.scss']
})
export class DroneRegistroComponent implements OnInit {
  drone: any = { modelo: '', tipo: '', capacidad: '', descripcion: '', mantenimiento: '' };
  id: string | null = null;

  constructor(
    private droneService: DroneService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.droneService.getDrone(this.id).subscribe(data => {
        this.drone = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.droneService.updateDrone(this.id, this.drone)
        .then(() => {
          console.log('Drone actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar drone:', err));
    } else {
      this.droneService.createDrone(this.drone)
        .then(() => {
          console.log('Drone creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear drone:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/mantenimiento/drone']);
  }
}
