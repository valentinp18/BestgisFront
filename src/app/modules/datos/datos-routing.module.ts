import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeListaComponent } from './component/informe/informe-lista/informe-lista.component';
import { InformeRegistroComponent } from './component/informe/informe-registro/informe-registro.component';

const routes: Routes = [
  { path: 'informe', component: InformeListaComponent },
  { path: 'informe/registro', component: InformeRegistroComponent },
  { path: 'informe/registro/:id', component: InformeRegistroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosRoutingModule { }