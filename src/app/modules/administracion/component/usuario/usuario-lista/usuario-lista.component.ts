import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/Usuario.service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.scss']
})
export class UsuarioListaComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  deleteUsuario(id: string): void {
    this.usuarioService.deleteUsuario(id)
      .then(() => console.log('Usuario eliminado'))
      .catch(err => console.log(err));
  }
}