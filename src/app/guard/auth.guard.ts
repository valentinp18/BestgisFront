import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../modules/auth/service/auth.service';
import { UsuarioService } from '../modules/administracion/service/Usuario.service';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (user && user.uid) {
          return this.usuarioService.getUserStatus(user.uid).pipe(
            map(status => {
              if (status === 'activo') {
                return true;
              } else {
                this.router.navigate(['/acceso-denegado']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}