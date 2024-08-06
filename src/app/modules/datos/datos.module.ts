import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { DatosRoutingModule } from './datos-routing.module';
import { InformeComponent } from './component/informe/informe.component';




@NgModule({
  declarations: [
    InformeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    DatosRoutingModule,
    SharedModule
  ]
})
export class DatosModule { }