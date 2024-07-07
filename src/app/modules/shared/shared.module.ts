import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({ declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        PaginationModule
    ], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(), // ==> sin este no podemos consumir ningun servio web
        PaginationModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SharedModule { }
