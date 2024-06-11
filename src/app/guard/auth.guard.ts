import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  // debugger;

  let token = sessionStorage.getItem("token");

  if(!token)
  {
    alert("guard ==> no iniciaste sesión")
    //DEBEMOS REDIRIGIR AL USUARIO HACIA LA PANTALLA DEL LOGIN
    return false;
  }
  return true;
};
