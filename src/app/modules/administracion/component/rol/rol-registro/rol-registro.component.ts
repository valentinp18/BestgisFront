import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolService } from '../../../service/Rol.service';

@Component({
  selector: 'app-rol-registro',
  templateUrl: './rol-registro.component.html',
  styleUrls: ['./rol-registro.component.scss']
})
export class RolRegistroComponent implements OnInit {
  rol: any = { nombre: '', funcion: '' };
  id: string | null = null;

  constructor(
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.rolService.getRol(this.id).subscribe(data => {
        this.rol = data;
      });
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.rolService.updateRol(this.id, this.rol)
        .then(() => {
          console.log('Rol actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar rol:', err));
    } else {
      this.rolService.createRol(this.rol)
        .then(() => {
          console.log('Rol creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear rol:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/administracion/rol']);
  }
}
