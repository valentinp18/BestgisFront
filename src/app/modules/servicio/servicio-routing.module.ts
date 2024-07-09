import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListaComponent } from './component/cliente/cliente-lista/cliente-lista.component';
import { ClienteRegistroComponent } from './component/cliente/cliente-registro/cliente-registro.component';
import { MisionListaComponent } from './component/mision/mision-lista/mision-lista.component';
import { MisionRegistroComponent } from './component/mision/mision-registro/mision-registro.component';

const routes: Routes = [
  { path: 'cliente', component: ClienteListaComponent },
  { path: 'cliente/registro', component: ClienteRegistroComponent },
  { path: 'cliente/registro/:id', component: ClienteRegistroComponent },
  { path: 'mision', component: MisionListaComponent },
  { path: 'mision/registro', component: MisionRegistroComponent },
  { path: 'mision/registro/:id', component: MisionRegistroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioRoutingModule { }