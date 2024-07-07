import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { alert_error } from '../functions/general.functions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //debugger;
    let token = sessionStorage.getItem("token");
    //puedo obtener otras variables
    //SIMULAR LOS ERRORES

    let request = req;
    if (token) {
      request = req.clone(
        {
          setHeaders: {
            authorization: `Bearer ${token}`
          }
        });
    }

    return next.handle(request).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          let error = err.error;
          switch (err.status) {
            case 400: //TODO: BAD REQUEST
              alert_error("ERROR DE BAD REQUEST", "DATOS ENVIADOS INCORRECTOS");
              break;
            case 401: //TODO: NO TIENES TOKEN TOKEN INVALIDO | NO TIENES PERMISOS
              alert_error("SE SESIÓN HA CADUCADO", "VUELVA A REALIZAR EL LOGIN");
              this.router.navigate(['']);
              break;
            case 404: //TODO: URL NO ENCONTRADA
              alert_error("RECURSO NO ENCONTRADO", "");
              break;
            case 403: //TODO: NO TIENES PERMISOS PARA EJECUTAR UNA DETERMINADA ACCIÓN
              alert_error("PERMISOS INSUFICIENTES", "Coordine con su administrador");
              break;
            case 500: //TODO: ERROR NO CONTROLADO
              alert_error("OCURRIO UN ERROR", "Intentelo mas tarde");
              break;
            case 0:
              alert_error("OCURRIO UN ERROR", "No podemos comunicarno con el servicio");
              break;
            default:
              alert("ERROR NO CONTROLADO");
              break;
          }
          return throwError(() => { err });
        })
    );
  }
}
