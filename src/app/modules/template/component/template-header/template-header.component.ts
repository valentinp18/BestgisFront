import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service'; 
import { UsuarioService } from '../../../administracion/service/Usuario.service';

@Component({
  selector: 'app-template-header',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.scss']
})
export class TemplateHeaderComponent implements OnInit {
  userName: string = '';
  userPhotoUrl: string | null = null;
  defaultAvatarUrl = 'https://raw.githubusercontent.com/valentinp18/imagenesBest/main/sinfoto.jpg';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuarioService.getUsuarioByUid(user.uid).subscribe(
          userData => {
            this.userName = userData.nombre || 'Usuario';
            this.userPhotoUrl = userData.photoURL || null;
          },
          error => {
            console.error('Error al cargar datos del usuario:', error);
            this.userName = 'Usuario';
            this.userPhotoUrl = null;
          }
        );
      }
    });
  }

  goToProfile() {
    this.router.navigate(['profile'], { relativeTo: this.route });
  }

  confirmLogout() {
    this.authService.logout().then(() => {
      const modal = document.getElementById('logoutModal');
      if (modal) {
        (modal as any).classList.remove('show');
        (modal as any).style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
      this.router.navigate(['/'])
        .then(() => {
          window.location.reload();
        });
    });
  }
}