import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
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


@NgModule({
  declarations: [
    ClimaListaComponent, 
    ClimaRegistroComponent,
    CultivoListaComponent,
    CultivoRegistroComponent,
    DroneListaComponent,
    DroneRegistroComponent,
    ProductoListaComponent,
    ProductoRegistroComponent,
    UbicacionListaComponent,
    UbicacionRegistroComponent,
    TierraListaComponent,
    TierraRegistroComponent
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }