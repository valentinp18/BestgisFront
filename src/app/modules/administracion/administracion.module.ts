import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SharedModule } from '../shared/shared.module';
import { RolListaComponent } from './component/rol/rol-lista/rol-lista.component';
import { RolRegisterComponent } from './component/rol/rol-registro/rol-registro.component';
import { AdministracionRoutingModule } from './administracion-routing.module';



@NgModule({
  declarations: [
    RolListaComponent,
    RolRegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    AdministracionRoutingModule,
    SharedModule
  ]
})
export class AdministracionModule { }
