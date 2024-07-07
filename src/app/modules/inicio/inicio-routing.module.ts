import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioPageComponent } from './page/inicio-page.component';

const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'auth', 
    loadChildren: () => import("../auth/auth.module").then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
