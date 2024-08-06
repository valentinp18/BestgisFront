import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-sidebar',
  templateUrl: './template-sidebar.component.html',
  styleUrls: ['./template-sidebar.component.scss']
})
export class TemplateSidebarComponent implements OnInit {
  menu: any[] = [];
  activeMenus: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.rellenarMenu();
    this.initializeActiveMenus();
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
          { name: "Tierra", url: "mantenimiento/tierra", icon: "fas fa-mountain" },
        ]
      },
      {
        name: "SERVICIO", target: "TargetInforme", icon: "fas fa-file-alt",
        subMenu: [
          { name: "Cliente", url: "servicio/cliente", icon: "fas fa-user-plus" },
          { name: "Mision", url: "servicio/mision", icon: "fas fa-rocket" },
          { name: "Seguimiento", url: "servicio/seguimiento", icon: "fas fa-eye" }
        ]
      },
      {
        name: "DATOS", target: "TargetDatos", icon: "fas fa-database",
        subMenu: [
          { name: "Informe", url: "datos/informe", icon: "fas fa-file-alt" },
          { name: "Analisis", url: "datos/analisis", icon: "fas fa-chart-line" }
        ]
      },
    ];
  }

  initializeActiveMenus() {
    this.menu.forEach(item => {
      this.activeMenus[item.target] = false;
    });
  }

  toggleMenu(target: string) {
    this.activeMenus[target] = !this.activeMenus[target];
  }

  isMenuActive(target: string): boolean {
    return this.activeMenus[target];
  }
}