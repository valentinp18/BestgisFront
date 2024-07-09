import { Component, OnInit } from '@angular/core';
import { InformeService } from '../../../service/Informe.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-informe-lista',
  templateUrl: './informe-lista.component.html',
  styleUrls: ['./informe-lista.component.scss']
})
export class InformeListaComponent implements OnInit {
  informes: any[] = [];

  constructor(
    private informeService: InformeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInformes();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getInformes();
    });
  }

  getInformes(): void {
    this.informeService.getInformes().subscribe(data => {
      this.informes = data;
    });
  }

  deleteInforme(id: string): void {
    this.informeService.deleteInforme(id)
      .then(() => {
        console.log('Informe eliminado');
        this.getInformes();
      })
      .catch(err => console.log(err));
  }
}