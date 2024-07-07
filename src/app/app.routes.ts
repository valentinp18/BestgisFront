import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { authGuard } from './guard/auth.guard';
import { InicioPageComponent } from './modules/inicio/page/inicio-page.component';

const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'auth',
    loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import("./modules/template/template.module").then(m => m.TemplateModule)
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
