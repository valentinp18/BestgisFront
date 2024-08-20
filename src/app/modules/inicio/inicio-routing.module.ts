import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioPageComponent } from './page/inicio-page.component';
import { NosotrosPageComponent } from './nosotros/nosotros-page.component';
import { ContactoPageComponent } from './contacto/contacto-page.component';

const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'nosotros',
    component: NosotrosPageComponent
  },
  {
    path: 'contacto',
    component: ContactoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }