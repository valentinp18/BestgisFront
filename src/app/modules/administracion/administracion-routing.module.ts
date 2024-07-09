import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';
import { RolRegistroComponent } from './component/rol/rol-registro/rol-registro.component';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';
import { ColaboradorRegistroComponent } from './component/colaborador/colaborador-registro/colaborador-registro.component';

const routes: Routes = [
  { path: 'rol', component: RolListaComponent },
  { path: 'rol/registro', component: RolRegistroComponent },
  { path: 'rol/registro/:id', component: RolRegistroComponent },
  { path: 'colaborador', component: ColaboradorListaComponent },
  { path: 'colaborador/registro', component: ColaboradorRegistroComponent },
  { path: 'colaborador/registro/:id', component: ColaboradorRegistroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
