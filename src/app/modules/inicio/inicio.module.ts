import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioPageComponent } from './page/inicio-page.component';
import { NosotrosPageComponent } from './nosotros/nosotros-page.component';
import { ContactoPageComponent } from './contacto/contacto-page.component';

@NgModule({
  declarations: [
    InicioPageComponent,
    NosotrosPageComponent,
    ContactoPageComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule
  ]
})
export class InicioModule { }