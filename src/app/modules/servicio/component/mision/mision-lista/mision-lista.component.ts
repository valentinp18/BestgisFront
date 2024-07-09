import { Component, OnInit } from '@angular/core';
import { MisionService } from '../../../service/Mision.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-mision-lista',
  templateUrl: './mision-lista.component.html',
  styleUrls: ['./mision-lista.component.scss']
})
export class MisionListaComponent implements OnInit {
  misiones: any[] = [];

  constructor(
    private misionService: MisionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMisiones();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getMisiones();
    });
  }

  getMisiones(): void {
    this.misionService.getMisiones().subscribe(data => {
      this.misiones = data;
    });
  }

  deleteMision(id: string): void {
    this.misionService.deleteMision(id)
      .then(() => {
        console.log('Misión eliminada');
        this.getMisiones();
      })
      .catch(err => console.log(err));
  }
}