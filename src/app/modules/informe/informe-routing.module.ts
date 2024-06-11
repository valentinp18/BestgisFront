import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoRegisterComponent } from './component/nuevo/nuevo-registro.component';

const routes: Routes = [

  {
    path: 'nuevo', component: NuevoRegisterComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeRoutingModule { }
