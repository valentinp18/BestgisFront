import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteRequest } from '../../../mantenimiento/models/Cliente-request.module';
import { PersonaRequest } from '../../../mantenimiento/models/Persona-request.module';
import { UbicacionRequest } from '../../../mantenimiento/models/Ubicacion-request.module';
import { DroneService } from '../../../mantenimiento/service/Drone.service';
import { DroneResponse } from '../../../mantenimiento/models/Drone-response.module';
import { ClimaService } from '../../../mantenimiento/service/Clima.service';
import { ClimaResponse } from '../../../mantenimiento/models/Clima-response.module';
import { CultivoService } from '../../../mantenimiento/service/Cultivo.service';
import { CultivoResponse } from '../../../mantenimiento/models/Cultivo-response.module';
import { ProductoService } from '../../../mantenimiento/service/Producto.service';
import { ProductoResponse } from '../../../mantenimiento/models/Producto-response.module';
import { CampoAgricolaService } from '../../../mantenimiento/service/CampoAgricola.service';
import { CampoAgricolaResponse } from '../../../mantenimiento/models/CampoAgricola-response.module';

@Component({
  selector: 'app-Cliente-register',
  templateUrl: './nuevo-registro.component.html',
  styleUrls: ['./nuevo-registro.component.scss']
})
export class NuevoRegisterComponent implements OnInit {

  @Input() title: string = "";
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  clienteEnvio: ClienteRequest = new ClienteRequest();
  persona: PersonaRequest = new PersonaRequest();
  ubicacion: UbicacionRequest = new UbicacionRequest();
  drones: DroneResponse[] = [];
  climas: ClimaResponse[] = [];
  cultivos: CultivoResponse[] = [];
  productos: ProductoResponse[] = [];
  campoAgricolas: CampoAgricolaResponse[] = [];
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _droneService: DroneService,
    private _climaService: ClimaService,
    private _cultivoService: CultivoService, 
    private _productoService: ProductoService,
    private _campoService: CampoAgricolaService 
  ) {
    this.myForm = this.fb.group({
      cliente: this.fb.group({
        nombres: [null, [Validators.required]],
        apellidos: [null, [Validators.required]],
        dni: [null, [Validators.required]],
        telefono: [null, [Validators.required]],
      }),
      ubicacion: this.fb.group({
        nombre: [null, [Validators.required]],
        gps: [null, [Validators.required]],
        observacion: [null, [Validators.required]],
      }),
      drone: [null, [Validators.required]],
      clima: [null, [Validators.required]],
      cultivo: [null, [Validators.required]],
      producto: [null, [Validators.required]],
      campo: [null, [Validators.required]] 
    });
  }

  ngOnInit(): void {
    this.obtenerDrones();
    this.obtenerClimas();
    this.obtenerCultivos();
    this.obtenerProductos();
    this.obtenerCamposAgricolas()
  }

  obtenerDrones() {
    this._droneService.getAll().subscribe({
      next: (data: DroneResponse[]) => {
        this.drones = data;
      },
    });
  }

  obtenerClimas() {
    this._climaService.getAll().subscribe({
      next: (data: ClimaResponse[]) => {
        this.climas = data;
      },
    });
  }

  obtenerCultivos() {
    this._cultivoService.getAll().subscribe({
      next: (data: CultivoResponse[]) => {
        this.cultivos = data;
      },
    });
  }

  obtenerProductos() {
    this._productoService.getAll().subscribe({
      next: (data: ProductoResponse[]) => {
        this.productos = data;
      },
    });
  }

  obtenerCamposAgricolas() {
    this._campoService.getAll().subscribe({
      next: (data: CampoAgricolaResponse[]) => {
        this.campoAgricolas = data;
      },
    });
  }

  guardar() {
    const informeData = this.myForm.getRawValue();
    const datosCliente = informeData.cliente;
    const datosUbicacion = informeData.ubicacion;
    const dronSeleccionado = informeData.drone;
    const climaSeleccionado = informeData.clima;
    const cultivoSeleccionado = informeData.cultivo;
    const productoSeleccionado = informeData.producto;
    const campoSeleccionado = informeData.campo;
    console.log("Cliente registrado:", datosCliente);
    console.log("Datos de Ubicación:", datosUbicacion);
    console.log("Dron seleccionado:", dronSeleccionado);
    console.log("Clima seleccionado:", climaSeleccionado); 
    console.log("Cultivo seleccionado:", cultivoSeleccionado);
    console.log("Producto seleccionado:", productoSeleccionado);
    console.log("Campo Agricola seleccionado:", campoSeleccionado);
    this.cerrarModal(true);
  }

  cerrarModal(res: boolean) {
    this.closeModalEmmit.emit(res);
  }
}