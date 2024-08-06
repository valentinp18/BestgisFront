import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeComponent } from './component/informe/informe.component';


const routes: Routes = [
  { path: 'informe', component: InformeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosRoutingModule { }