import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginRequest } from '../../models/login-request.model';
import { AuthService } from '../../service/auth.service';
import { LoginResponse } from '../../../../models/login-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginRequest: LoginRequest = new LoginRequest();

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService, 
    private _router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  login() {
    console.log(this.loginForm.getRawValue());
    this.loginRequest = this.loginForm.getRawValue();

    this._authService.login(this.loginRequest).subscribe({
      next: (data: LoginResponse) => {
        console.log(data);
        if (data.success) {
          sessionStorage.setItem("token", data.token );
          sessionStorage.setItem("idUsuario", data.usuario.id.toString() );
          sessionStorage.setItem("username", data.usuario.username );
          sessionStorage.setItem("rolId", data.rol.idRol.toString() );
          this._router.navigate(['dashboard']);
        } else {
          alert("Error: " + data.mensaje); 
        }
      },
      error: (err) => {},
      complete: () => { },
    });
  }
}
