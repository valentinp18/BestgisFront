import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { ServicioRoutingModule } from './servicio-routing.module';




@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    FormsModule, 
    ServicioRoutingModule,
    SharedModule
  ]
})
export class ServicioModule { }
