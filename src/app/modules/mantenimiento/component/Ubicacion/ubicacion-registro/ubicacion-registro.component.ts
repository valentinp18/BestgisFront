import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionService } from '../../../service/Ubicacion.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubicacion-registro',
  templateUrl: './ubicacion-registro.component.html',
  styleUrls: ['./ubicacion-registro.component.scss']
})
export class UbicacionRegistroComponent implements OnInit, OnDestroy, AfterViewInit {
  ubicacion: any = { departamento: '', provincia: '', distrito: '', centro_poblado: '', gps: '' };
  id: string | null = null;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  showMap: boolean = false;
  private mapInitialized = false;

  // Coordenadas por defecto (Tarapoto, San Martín)
  private defaultLat: number = -6.4824;
  private defaultLng: number = -76.3726;

  private mapboxToken = 'pk.eyJ1IjoidmFsZW50eCIsImEiOiJjbHl1bWN3cjcxMjJkMmpwdTY3c20zc3N6In0.6KIkAQoOC1KL8p4tnF-WvA'; // Reemplaza esto con tu token real

  constructor(
    private ubicacionService: UbicacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.ubicacionService.getUbicacion(this.id).subscribe(data => {
        this.ubicacion = data;
      });
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
      this.mapInitialized = false;
    }
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => {
        this.initMap();
      }, 100);
    } else {
      this.destroyMap();
    }
  }

  private initMap(): void {
    if (this.mapInitialized) {
      return;
    }

    let lat = this.defaultLat;
    let lng = this.defaultLng;

    if (this.ubicacion.gps) {
      [lat, lng] = this.ubicacion.gps.split(',').map(Number);
    }

    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: this.mapboxToken,
      crossOrigin: true,
    }).addTo(this.map);

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], {draggable: true}).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
        this.updateGPSValue(e.latlng);
      }
    });

    const marker = this.marker;
    if (marker) {
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        this.updateGPSValue(position);
      });
    }

    this.mapInitialized = true;

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  updateGPSValue(latlng: L.LatLng) {
    const lat = latlng.lat.toFixed(6);
    const lng = latlng.lng.toFixed(6);
    this.ubicacion.gps = `${lat}, ${lng}`;
  }

  onSubmit(): void {
    const operation = this.id
      ? this.ubicacionService.updateUbicacion(this.id, this.ubicacion)
      : this.ubicacionService.createUbicacion(this.ubicacion);

    operation
      .then(() => {
        console.log(`Ubicación ${this.id ? 'actualizada' : 'creada'} con éxito`);
        this.destroyMap(); // Asegúrate de destruir el mapa antes de navegar
        this.navigateToList();
      })
      .catch(err => {
        console.error(`Error al ${this.id ? 'actualizar' : 'crear'} ubicación:`, err);
        // Manejo de errores aquí
      });
  }

  cancelar(): void {
    this.destroyMap();
    this.navigateToList();
  }

  private navigateToList(): void {
    setTimeout(() => {
      this.router.navigate(['dashboard/mantenimiento/ubicacion'], { replaceUrl: true });
    }, 100);
  }
}