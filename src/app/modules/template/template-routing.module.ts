import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './component/template/template.component';

const routes: Routes = [
  {
    path: '', component: TemplateComponent,
    children: [
      {
        path: 'administracion', loadChildren: () => import("./../administracion/administracion.module").then(x => x.AdministracionModule)
      },
      {
        path: 'mantenimiento', loadChildren: () => import("../mantenimiento/mantenimiento.module").then(x => x.MantenimientoModule)
      },
      {
        path: 'servicio', loadChildren: () => import("./../servicio/servicio.module").then(x => x.ServicioModule)
      },
      {
        path: 'datos', loadChildren: () => import("./../datos/datos.module").then(x => x.DatosModule)
      },
     
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
