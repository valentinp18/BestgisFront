import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './component/template/template.component';
import { TemplateHeaderComponent } from './component/template-header/template-header.component';
import { TemplateFooterComponent } from './component/template-footer/template-footer.component';
import { TemplateSidebarComponent } from './component/template-sidebar/template-sidebar.component';
import { ProfileComponent } from './component/profile/profile.component';
import { DashboardHomeComponent } from './component/home/dashboard-home.component';

@NgModule({
  declarations: [
    ProfileComponent,
    TemplateComponent,
    TemplateHeaderComponent,
    TemplateFooterComponent,
    TemplateSidebarComponent,
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    FormsModule,
    RouterModule,
  ]
})
export class TemplateModule { }