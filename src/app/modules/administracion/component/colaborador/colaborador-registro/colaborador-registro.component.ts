// colaborador-registro.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColaboradorService } from '../../../service/Colaborador.service';

@Component({
  selector: 'app-colaborador-registro',
  templateUrl: './colaborador-registro.component.html',
  styleUrls: ['./colaborador-registro.component.scss']
})
export class ColaboradorRegistroComponent implements OnInit {
  colaborador: any = {
    correo: '',
    nombre: '',
    apellido: '',
    tipo_documento: '',
    numero_documento: '',
    sexo: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: ''
  };
  id: string | null = null;
  isLoading: boolean = false;

  constructor(
    private colaboradorService: ColaboradorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadColaborador(this.id);
    }
  }

  loadColaborador(id: string): void {
    this.isLoading = true;
    this.colaboradorService.getColaborador(id).subscribe(
      data => {
        this.colaborador = data;
        if (this.colaborador.fecha_nacimiento) {
          this.colaborador.fecha_nacimiento = this.convertirFechaParaInput(this.colaborador.fecha_nacimiento);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el colaborador:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.colaborador.fecha_nacimiento) {
      this.colaborador.fecha_nacimiento = this.convertirFechaParaFirestore(this.colaborador.fecha_nacimiento);
    }

    if (this.id) {
      this.colaboradorService.updateColaborador(this.id, this.colaborador)
        .then(() => {
          console.log('Colaborador actualizado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al actualizar colaborador:', err));
    } else {
      this.colaboradorService.createColaborador(this.colaborador)
        .then(() => {
          console.log('Colaborador creado con éxito');
          this.navigateToList();
        })
        .catch(err => console.error('Error al crear colaborador:', err));
    }
  }

  cancelar(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['dashboard/administracion/colaborador']);
  }

  convertirFechaParaInput(fechaString: string): string {
    const [dia, mes, anio] = fechaString.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  convertirFechaParaFirestore(fechaInput: string): string {
    const [anio, mes, dia] = fechaInput.split('-');
    return `${dia}/${mes}/${anio}`;
  }
}