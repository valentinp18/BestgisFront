import { Component, OnInit } from '@angular/core';
import { RolService } from '../../../service/Rol.service';

@Component({
  selector: 'app-rol-lista',
  templateUrl: './rol-lista.component.html',
  styleUrls: ['./rol-lista.component.scss']
})
export class RolListaComponent implements OnInit {
  roles: any[] = [];

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.rolService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  deleteRol(id: string): void {
    this.rolService.deleteRol(id)
      .then(() => console.log('Rol eliminado'))
      .catch(err => console.log(err));
  }
}
