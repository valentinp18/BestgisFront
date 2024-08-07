import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';
import { ColaboradorRegistroComponent } from './component/colaborador/colaborador-registro/colaborador-registro.component';
import { UsuarioListaComponent } from './component/usuario/usuario-lista/usuario-lista.component';
import { UsuarioRegistroComponent } from './component/usuario/usuario-registro/usuario-registro.component';

const routes: Routes = [
  { path: 'colaborador', component: ColaboradorListaComponent },
  { path: 'colaborador/registro', component: ColaboradorRegistroComponent },
  { path: 'colaborador/registro/:id', component: ColaboradorRegistroComponent },
  { path: 'usuario', component: UsuarioListaComponent },
  { path: 'usuario/registro', component: UsuarioRegistroComponent },
  { path: 'usuario/registro/:id', component: UsuarioRegistroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
