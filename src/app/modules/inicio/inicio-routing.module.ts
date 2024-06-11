// inicio-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioPageComponent } from './page/inicio-page.component';

const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'auth', // Esta es la ruta a la que queremos redirigir
    loadChildren: () => import("../auth/auth.module").then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
