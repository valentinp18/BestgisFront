import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  passwordVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showResetPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  login() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (token) => {
          if (token) {
            console.log('Login exitoso');
            this.router.navigate(['dashboard']);
          } else {
            this.errorMessage = 'Error de autenticación. Por favor, verifica tus credenciales.';
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
          if (err.message === 'Usuario inactivo') {
            this.errorMessage = 'No tienes permisos para ingresar al sistema.';
          } else if (err.message === 'Usuario no encontrado') {
            this.errorMessage = 'Usuario no encontrado. Por favor, verifica tus credenciales.';
          } else {
            this.errorMessage = 'Error de autenticación. Por favor, verifica tus credenciales.';
          }
        }
      });
    }
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById("form3Example4") as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? "text" : "password";
  }

  toggleResetPassword() {
    this.showResetPassword = !this.showResetPassword;
    this.errorMessage = '';
    this.successMessage = '';
  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.get('email')?.value;
      this.authService.resetPassword(email).subscribe({
        next: () => {
          this.successMessage = 'Se ha enviado un correo para restablecer tu contraseña.';
          setTimeout(() => this.toggleResetPassword(), 3000);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }
}