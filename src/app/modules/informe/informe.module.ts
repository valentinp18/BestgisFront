import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { InformeRoutingModule } from './informe-routing.module';
import { NuevoRegisterComponent } from './component/nuevo/nuevo-registro.component';
//import { ClimaRegisterComponent } from './component/Clima/clima-registro/clima-registro.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NuevoRegisterComponent
//    ClimaRegisterComponent es para hacer los demas
  ],
  imports: [
    CommonModule,
    FormsModule, 
    InformeRoutingModule,
    SharedModule
  ]
})
export class InformeModule { }
