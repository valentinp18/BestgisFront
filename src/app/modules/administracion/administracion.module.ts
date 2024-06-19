import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';
import { RolRegisterComponent } from './component/rol/rol-registro/rol-registro.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { UsuarioListaComponent } from './component/usuario/usuario-lista/usuario-lista.component';
import { UsuarioRegisterComponent } from './component/usuario/usuario-registro/usuario-registro.component';
import { ColaboradorListaComponent } from './component/colaborador/colaborador-lista/colaborador-lista.component';
import { ColaboradorRegisterComponent } from './component/colaborador/colaborador-registro/colaborador-registro.component';



@NgModule({
  declarations: [
    RolListaComponent,
    RolRegisterComponent,
    UsuarioListaComponent,
    UsuarioRegisterComponent,
    ColaboradorListaComponent,
    ColaboradorRegisterComponent

  ],
  imports: [
    CommonModule,
    FormsModule, 
    AdministracionRoutingModule,
    SharedModule
  ]
})
export class AdministracionModule { }
