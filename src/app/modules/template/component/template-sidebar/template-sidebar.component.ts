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
    let rolId = sessionStorage.getItem("rolId");
    
    switch (rolId) {
      //TODO: CUANDO ES ADMINISTRADOR
      case "1":
        this.menu = [
          {
            name: "MANTENIMIENTO", target: "TargerMantenimiento", icon: "fas fa-tools",
            subMenu: [
              { name: "Clima", url: "mantenimiento/clima", icon: "fas fa-card" },
              { name: "Cultivo", url: "mantenimiento/cultivo", icon: "fas fa-card" },
              { name: "Drone", url: "mantenimiento/drone", icon: "fas fa-card" },
              { name: "Producto", url: "", icon: "fas fa-card" },
              { name: "Tipo de Tierra", url: "", icon: "fas fa-card" },
            ]
          },
          {
            name: "INFORME", target: "TargerMantenimiento", icon: "fas fa-pencil-alt",
            subMenu: [
              { name: "Nuevo", url: "informe/nuevo", icon: "fas fa-card" },
            ]
          },
        ];
        break;
      case "2": break;
      case "3": break;
      case "4": break;
      case "5": break;
      case "6": break;
    }
  }
}
