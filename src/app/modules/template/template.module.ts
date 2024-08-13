import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './component/template/template.component';
import { TemplateHeaderComponent } from './component/template-header/template-header.component';
import { TemplateFooterComponent } from './component/template-footer/template-footer.component';
import { TemplateSidebarComponent } from './component/template-sidebar/template-sidebar.component';
import { ProfileComponent } from './component/profile/profile.component';


@NgModule({
  declarations: [
    ProfileComponent,
    TemplateComponent,
    TemplateHeaderComponent,
    TemplateFooterComponent,
    TemplateSidebarComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    FormsModule 
  ]
})
export class TemplateModule { }
