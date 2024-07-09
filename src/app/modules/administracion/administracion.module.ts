import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';
import { RolRegistroComponent } from './component/rol/rol-registro/rol-registro.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';
import { ColaboradorRegistroComponent } from './component/colaborador/colaborador-registro/colaborador-registro.component';



@NgModule({
  declarations: [
    RolListaComponent,
    RolRegistroComponent,
    ColaboradorListaComponent,
    ColaboradorRegistroComponent

  ],
  imports: [
    CommonModule,
    FormsModule, 
    AdministracionRoutingModule,
    SharedModule
  ]
})
export class AdministracionModule { }
