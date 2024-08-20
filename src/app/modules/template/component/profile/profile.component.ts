import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { UsuarioService } from '../../../administracion/service/Usuario.service';
import { Observable, of , map} from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData$!: Observable<any>;
  loading = true;
  error: string | null = null;
  defaultAvatarUrl = 'https://raw.githubusercontent.com/valentinp18/imagenesBest/main/sinfoto.jpg';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    console.log('ProfileComponent inicializado');
    this.loadProfileData();
  }


  loadProfileData() {
    this.profileData$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.usuarioService.getUsuarioByUid(user.uid).pipe(
            map(usuario => {
              if (usuario) {
                return {
                  ...usuario,
                  nombre: usuario.nombre || usuario.nombre_completo?.split(' ')[0] || 'N/A',
                  apellido: usuario.apellido || usuario.nombre_completo?.split(' ').slice(1).join(' ') || 'N/A'
                };
              }
              return null;
            }),
            catchError(error => {
              console.error('Error al obtener datos del usuario:', error);
              this.error = 'Error al cargar los datos del perfil';
              return of(null);
            })
          );
        }
        this.error = 'No se encontró usuario autenticado';
        return of(null);
      }),
      tap(
        profile => {
          this.loading = false;
          if (profile) {
            console.log('Datos del perfil cargados:', profile);
          } else {
            this.error = 'No se encontró el perfil del usuario';
          }
        },
        error => {
          console.error('Error en la carga del perfil:', error);
          this.error = 'Error al cargar los datos del perfil';
          this.loading = false;
        }
      )
    );
  }

  uploadProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.usuarioService.uploadProfileImage(user.uid, file).subscribe(
            url => {
              console.log('Foto de perfil actualizada:', url);
              this.loadProfileData();
            },
            error => console.error('Error al actualizar la foto de perfil:', error)
          );
        }
      });
    }
  }

  deleteProfileImage() {
    if (confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.usuarioService.deleteProfileImage(user.uid).subscribe(
            () => {
              console.log('Foto de perfil eliminada');
              this.loadProfileData();
            },
            error => console.error('Error al eliminar la foto de perfil:', error)
          );
        }
      });
    }
  }
}