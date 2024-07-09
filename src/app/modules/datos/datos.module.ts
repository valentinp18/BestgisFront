import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { DatosRoutingModule } from './datos-routing.module';
import { InformeListaComponent } from './component/informe/informe-lista/informe-lista.component';
import { InformeRegistroComponent } from './component/informe/informe-registro/informe-registro.component';




@NgModule({
  declarations: [
    InformeListaComponent,
    InformeRegistroComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    DatosRoutingModule,
    SharedModule
  ]
})
export class DatosModule { }