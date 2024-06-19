import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';
import { UsuarioListaComponent } from './component/usuario/usuario-lista/usuario-lista.component';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';

const routes: Routes = [

  {
    path: 'rol', component: RolListaComponent
  },
  {
    path: 'usuario', component: UsuarioListaComponent
  },
  {
    path: 'colaborador', component: ColaboradorListaComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
