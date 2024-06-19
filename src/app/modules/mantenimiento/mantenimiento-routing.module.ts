import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClimaListaComponent } from './component/Clima/clima-lista/clima-lista.component';
import { CultivoListaComponent } from './component/Cultivo/cultivo-lista/cultivo-lista.component';
import { DroneListaComponent } from './component/Drone/drone-lista/drone-lista.component';
import { ProductoListaComponent } from './component/Producto/producto-lista/producto-lista.component';
import { UbicacionListaComponent } from './component/Ubicacion/ubicacion-lista/ubicacion-lista.component';
import { CampoAgricolaListaComponent } from './component/CampoAgricola/campo-lista/campo-lista.component';


const routes: Routes = [

  {
    path: 'clima', component: ClimaListaComponent
  },
  {
    path: 'cultivo', component: CultivoListaComponent
  },
  {
    path: 'drone', component: DroneListaComponent
  },

  {
    path: 'producto', component: ProductoListaComponent
  },
  {
    path: 'ubicacion', component: UbicacionListaComponent
  },
  {
    path: 'campo', component: CampoAgricolaListaComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
