import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let token = sessionStorage.getItem("token");
  if(!token)
  {
    alert("guard ==> no iniciaste sesión")
    return false;
  }
  return true;
};
