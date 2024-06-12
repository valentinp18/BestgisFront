import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
=======

>>>>>>> 7c915c89e0944f73fdeb5cab06adf7f136ab0fca
import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './component/template/template.component';
import { TemplateHeaderComponent } from './component/template-header/template-header.component';
import { TemplateFooterComponent } from './component/template-footer/template-footer.component';
import { TemplateSidebarComponent } from './component/template-sidebar/template-sidebar.component';


@NgModule({
  declarations: [
    TemplateComponent,
    TemplateHeaderComponent,
    TemplateFooterComponent,
    TemplateSidebarComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule
  ]
})
export class TemplateModule { }
