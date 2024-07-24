import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClimaListaComponent } from './component/Clima/clima-lista/clima-lista.component';
import { ClimaRegistroComponent } from './component/Clima/clima-registro/clima-registro.component';
import { CultivoListaComponent } from './component/Cultivo/cultivo-lista/cultivo-lista.component';
import { CultivoRegistroComponent } from './component/Cultivo/cultivo-registro/cultivo-registro.component';
import { DroneListaComponent } from './component/Drone/drone-lista/drone-lista.component';
import { DroneRegistroComponent } from './component/Drone/drone-registro/drone-registro.component';
import { ProductoListaComponent } from './component/Producto/producto-lista/producto-lista.component';
import { ProductoRegistroComponent } from './component/Producto/producto-registro/producto-registro.component';
import { UbicacionListaComponent } from './component/Ubicacion/ubicacion-lista/ubicacion-lista.component';
import { UbicacionRegistroComponent } from './component/Ubicacion/ubicacion-registro/ubicacion-registro.component';
import { TierraListaComponent } from './component/Tierra/tierra-lista/tierra-lista.component';
import { TierraRegistroComponent } from './component/Tierra/tierra-registro/tierra-registro.component';


const routes: Routes = [
  { path: 'clima', component: ClimaListaComponent },
  { path: 'clima/registro', component: ClimaRegistroComponent },
  { path: 'clima/registro/:id', component: ClimaRegistroComponent },
  { path: 'cultivo', component: CultivoListaComponent },
  { path: 'cultivo/registro', component: CultivoRegistroComponent },
  { path: 'cultivo/registro/:id', component: CultivoRegistroComponent },
  { path: 'drone', component: DroneListaComponent },
  { path: 'drone/registro', component: DroneRegistroComponent },
  { path: 'drone/registro/:id', component: DroneRegistroComponent },
  { path: 'producto', component: ProductoListaComponent },
  { path: 'producto/registro', component: ProductoRegistroComponent },
  { path: 'producto/registro/:id', component: ProductoRegistroComponent },
  { path: 'ubicacion', component: UbicacionListaComponent },
  { path: 'ubicacion/registro', component: UbicacionRegistroComponent },
  { path: 'ubicacion/registro/:id', component: UbicacionRegistroComponent },
  { path: 'tierra', component: TierraListaComponent },
  { path: 'tierra/registro', component: TierraRegistroComponent },
  { path: 'tierra/registro/:id', component: TierraRegistroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }