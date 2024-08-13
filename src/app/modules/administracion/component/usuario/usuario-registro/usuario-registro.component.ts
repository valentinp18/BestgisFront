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
  colaboradoresSinCuenta: any[] = [];
  id: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

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
    this.loadColaboradoresSinCuenta();
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
        this.errorMessage = 'Error al cargar el usuario. Por favor, intente de nuevo.';
        this.isLoading = false;
      }
    );
  }

  loadColaboradoresSinCuenta(): void {
    this.isLoading = true;
    this.colaboradorService.getColaboradores().subscribe(
      async data => {
        this.colaboradoresSinCuenta = [];
        for (let colaborador of data) {
          const tieneCuenta = await this.usuarioService.colaboradorTieneUsuario(colaborador.id);
          if (!tieneCuenta) {
            this.colaboradoresSinCuenta.push(colaborador);
          }
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar colaboradores:', error);
        this.errorMessage = 'Error al cargar colaboradores. Por favor, intente de nuevo.';
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.id) {
      this.usuarioService.updateUsuario(this.id, this.usuario)
        .then(() => {
          this.successMessage = 'Usuario actualizado con éxito';
          this.isLoading = false;
          setTimeout(() => this.navigateToList(), 2000);
        })
        .catch(err => {
          console.error('Error al actualizar usuario:', err);
          this.errorMessage = 'Error al actualizar usuario: ' + err.message;
          this.isLoading = false;
        });
    } else {
      this.usuarioService.createUsuario(this.usuario)
        .then(() => {
          this.successMessage = 'Usuario creado con éxito';
          this.isLoading = false;
          setTimeout(() => this.navigateToList(), 2000);
        })
        .catch(err => {
          console.error('Error al crear usuario:', err);
          this.errorMessage = 'Error al crear usuario: ' + err.message;
          this.isLoading = false;
        });
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/administracion/usuario']);
  }
}