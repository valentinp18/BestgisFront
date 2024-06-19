import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ClimaListaComponent } from './component/Clima/clima-lista/clima-lista.component';
import { ClimaRegisterComponent } from './component/Clima/clima-registro/clima-registro.component';
import { CultivoListaComponent } from './component/Cultivo/cultivo-lista/cultivo-lista.component';
import { CultivoRegisterComponent } from './component/Cultivo/cultivo-registro/cultivo-registro.component';
import { DroneListaComponent } from './component/Drone/drone-lista/drone-lista.component';
import { DroneRegisterComponent } from './component/Drone/drone-registro/drone-registro.component';
import { SharedModule } from '../shared/shared.module';
import { ProductoListaComponent } from './component/Producto/producto-lista/producto-lista.component';
import { ProductoRegisterComponent } from './component/Producto/producto-registro/producto-registro.component';
import { UbicacionListaComponent } from './component/Ubicacion/ubicacion-lista/ubicacion-lista.component';
import { UbicacionRegisterComponent } from './component/Ubicacion/ubicacion-registro/ubicacion-registro.component';
import { CampoAgricolaListaComponent } from './component/CampoAgricola/campo-lista/campo-lista.component';
import { CampoAgricolaRegisterComponent } from './component/CampoAgricola/campo-registro/campo-registro.component';

@NgModule({
  declarations: [
    ClimaListaComponent,
    ClimaRegisterComponent,
    CultivoListaComponent,
    CultivoRegisterComponent,
    DroneListaComponent,

    DroneRegisterComponent,
    ProductoListaComponent,
    ProductoRegisterComponent,
    UbicacionListaComponent,
    UbicacionRegisterComponent,
    CampoAgricolaListaComponent,
    CampoAgricolaRegisterComponent,
    DroneRegisterComponent

  ],
  imports: [
    CommonModule,
    FormsModule, 
    MantenimientoRoutingModule,
    SharedModule
  ]
})
export class MantenimientoModule { }
