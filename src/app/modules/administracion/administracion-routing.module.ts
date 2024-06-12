import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';

const routes: Routes = [

  {
    path: 'rol', component: RolListaComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
