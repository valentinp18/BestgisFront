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
<<<<<<< HEAD
            name: "ADMINISTRACION", target: "TargerMantenimiento", icon: "fas fa-pencil-alt",
            subMenu: [
              { name: "Rol", url: "administracion/rol", icon: "fas fa-card" },
            ]
          },
          {
=======
>>>>>>> 7c915c89e0944f73fdeb5cab06adf7f136ab0fca
            name: "MANTENIMIENTO", target: "TargerMantenimiento", icon: "fas fa-tools",
            subMenu: [
              { name: "Clima", url: "mantenimiento/clima", icon: "fas fa-card" },
              { name: "Cultivo", url: "mantenimiento/cultivo", icon: "fas fa-card" },
              { name: "Drone", url: "mantenimiento/drone", icon: "fas fa-card" },
<<<<<<< HEAD
              { name: "Producto", url: "mantenimiento/producto", icon: "fas fa-card" },
              { name: "Ubicación", url: "mantenimiento/ubicacion", icon: "fas fa-card" },
              { name: "Campo Agricola", url: "mantenimiento/campo", icon: "fas fa-card" },
=======
              { name: "Producto", url: "", icon: "fas fa-card" },
              { name: "Tipo de Tierra", url: "", icon: "fas fa-card" },
>>>>>>> 7c915c89e0944f73fdeb5cab06adf7f136ab0fca
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
