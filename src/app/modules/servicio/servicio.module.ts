import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { ServicioRoutingModule } from './servicio-routing.module';
import { ClienteListaComponent } from './component/cliente/cliente-lista/cliente-lista.component';
import { ClienteRegistroComponent } from './component/cliente/cliente-registro/cliente-registro.component';
import { MisionListaComponent } from './component/mision/mision-lista/mision-lista.component';
import { MisionRegistroComponent } from './component/mision/mision-registro/mision-registro.component';
import { SeguimientoComponent } from './component/seguimiento/seguimiento/seguimiento.component';




@NgModule({
  declarations: [
    ClienteListaComponent,
    ClienteRegistroComponent,
    MisionListaComponent,
    MisionRegistroComponent,
    SeguimientoComponent

  ],
  imports: [
    CommonModule,
    FormsModule, 
    ServicioRoutingModule,
    SharedModule
  ]
})
export class ServicioModule { }
