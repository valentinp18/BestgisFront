import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../service/Usuario.service';
import { ColaboradorService } from '../../../service/Colaborador.service';
import { from  } from 'rxjs';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.scss']
})
export class UsuarioRegistroComponent implements OnInit {
  usuario: any = {
    colaborador_id: '',
    estado: 'activo',
    email: '',
    nombre_completo: ''
  };
  colaboradorNombre: string = ''; 
  usuarioOriginal: any = {};
  colaboradores: any[] = [];
  id: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  photoFile: File | null = null;

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
    } else {
      this.loadColaboradores(); 
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.usuario.colaborador_id) {
      this.errorMessage = 'Debe seleccionar un colaborador';
      this.isLoading = false;
      return;
    }

    if (this.id) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario(): void {
    from(this.usuarioService.createUsuario({
      colaborador_id: this.usuario.colaborador_id,
      estado: this.usuario.estado || 'activo'
    })).subscribe({
      next: (result) => {
        console.log('Usuario creado con éxito:', result);
        this.successMessage = 'Usuario creado con éxito. Se ha enviado un correo de verificación y otro para restablecer la contraseña al colaborador.';
        setTimeout(() => this.navigateToList(), 2000);
      },
      error: (error: unknown) => {
        console.error('Error al crear usuario:', error);
        this.errorMessage = `Error al crear usuario: ${error instanceof Error ? error.message : 'Ocurrió un error desconocido'}`;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.id) return;
    const cambios = this.obtenerCambios();
    if (Object.keys(cambios).length === 0) {
      this.errorMessage = 'No hay cambios para actualizar';
      this.isLoading = false;
      return;
    }
    from(this.usuarioService.updateUsuario(this.id, cambios)).subscribe({
      next: () => {
        this.navigateToList();
      },
      error: (error: unknown) => {
        console.error('Error al actualizar usuario:', error);
        this.errorMessage = `Error al actualizar usuario: ${error instanceof Error ? error.message : 'Ocurrió un error desconocido'}`;
        this.isLoading = false;
      }
    });
  }

  obtenerCambios(): any {
    const cambios: any = {};
    if (this.usuario.estado !== this.usuarioOriginal.estado) {
      cambios.estado = this.usuario.estado;
    }
    return cambios;
  }

  loadUsuario(id: string): void {
    this.isLoading = true;
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.usuarioOriginal = { ...usuario };
        this.loadColaboradorNombre(usuario.colaborador_id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.errorMessage = 'Error al cargar el usuario. Por favor, intente de nuevo.';
        this.isLoading = false;
      }
    });
  }

  loadColaboradorNombre(colaboradorId: string): void {
    this.colaboradorService.getColaborador(colaboradorId).subscribe({
      next: (colaborador) => {
        this.colaboradorNombre = `${colaborador.nombre} ${colaborador.apellido}`;
      },
      error: (error) => {
        console.error('Error al cargar el colaborador:', error);
        this.errorMessage = 'Error al cargar los datos del colaborador.';
      }
    });
  }

  loadColaboradores(): void {
    this.isLoading = true;
    this.colaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar colaboradores:', error);
        this.errorMessage = 'Error al cargar colaboradores. Por favor, intente de nuevo.';
        this.isLoading = false;
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.photoFile = event.target.files[0];
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/administracion/usuario']);
  }
}