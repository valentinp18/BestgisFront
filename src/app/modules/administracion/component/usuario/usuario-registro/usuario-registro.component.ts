import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../service/Usuario.service';
import { ColaboradorService } from '../../../service/Colaborador.service';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.scss']
})
export class UsuarioRegistroComponent implements OnInit {
  usuario: any = {
    colaborador_id: '',
    estado: 'activo'
  };
  colaboradores: any[] = [];
  id: string | null = null;
  isLoading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private colaboradorService: ColaboradorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadUsuario(this.id);
    }
    this.loadColaboradores();
  }

  loadUsuario(id: string): void {
    this.isLoading = true;
    this.usuarioService.getUsuario(id).subscribe(
      data => {
        this.usuario = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el usuario:', error);
        this.isLoading = false;
      }
    );
  }

  loadColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(
      data => {
        this.colaboradores = data;
      },
      error => {
        console.error('Error al cargar colaboradores:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.id) {
      this.usuarioService.updateUsuario(this.id, this.usuario)
        .then(() => {
          console.log('Usuario actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar usuario:', err));
    } else {
      this.usuarioService.createUsuario(this.usuario)
        .then(() => {
          console.log('Usuario creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear usuario:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/administracion/usuario']);
  }
}