import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';
import { ColaboradorRegistroComponent } from './component/colaborador/colaborador-registro/colaborador-registro.component';
import { UsuarioListaComponent } from './component/usuario/usuario-lista/usuario-lista.component';
import { UsuarioRegistroComponent } from './component/usuario/usuario-registro/usuario-registro.component';



@NgModule({
  declarations: [
    ColaboradorListaComponent,
    ColaboradorRegistroComponent,
    UsuarioListaComponent,
    UsuarioRegistroComponent

  ],
  imports: [
    CommonModule,
    FormsModule, 
    AdministracionRoutingModule,
    SharedModule
  ]
})
export class AdministracionModule { }
