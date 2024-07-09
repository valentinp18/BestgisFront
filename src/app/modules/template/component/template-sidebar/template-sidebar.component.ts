import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.scss']
})
export class TemplateSidebarComponent implements OnInit {
  menu: any[] = [];

  ngOnInit(): void {
    this.rellenarMenu();
  }

  rellenarMenu() {
    this.menu = [
      {
        name: "ADMINISTRACION", target: "TargetAdministracion", icon: "fas fa-pencil-alt",
        subMenu: [
          { name: "Rol", url: "administracion/rol", icon: "fas fa-user-tag" },
          { name: "Usuario", url: "administracion/usuario", icon: "fas fa-user" },
          { name: "Colaborador", url: "administracion/colaborador", icon: "fas fa-users" }
        ]
      },
      {
        name: "MANTENIMIENTO", target: "TargetMantenimiento", icon: "fas fa-tools",
        subMenu: [
          { name: "Clima", url: "mantenimiento/clima", icon: "fas fa-cloud" },
          { name: "Cultivo", url: "mantenimiento/cultivo", icon: "fas fa-seedling" },
          { name: "Drone", url: "mantenimiento/drone", icon: "fas fa-plane" },
          { name: "Producto", url: "mantenimiento/producto", icon: "fas fa-box" },
          { name: "Ubicación", url: "mantenimiento/ubicacion", icon: "fas fa-map-marker-alt" },
          { name: "Campo Agricola", url: "mantenimiento/campo", icon: "fas fa-tractor" },
        ]
      },
      {
        name: "SERVICIO", target: "TargetInforme", icon: "fas fa-file-alt",
        subMenu: [
          { name: "Cliente", url: "servicio/cliente", icon: "fas fa-user-plus" },
          { name: "Mision", url: "servicio/mision", icon: "fas fa-rocket" }
        ]
      },
      {
        name: "DATOS", target: "TargetInforme", icon: "fas fa-database",
        subMenu: [
          { name: "Informe", url: "datos/informe", icon: "fas fa-file-alt" },
          { name: "Historial", url: "datos/historial", icon: "fas fa-history" },
          { name: "Analisis", url: "datos/analisis", icon: "fas fa-chart-line" }
        ]
      },
    ];
  }
}