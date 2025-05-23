import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  medicosMenuOpen = false;
  pacientesMenuOpen = false;
  consultasMenuOpen = false;

  constructor(private router: Router,
    private auth: AuthService
  ) { }

  isAuth(): boolean {
    return this.auth.isAuthenticated();
  }

  toggleMenu(menu: string) {
    if (menu === 'medicos') {
      this.medicosMenuOpen = !this.medicosMenuOpen;
    } else if (menu === 'pacientes') {
      this.pacientesMenuOpen = !this.pacientesMenuOpen;
    } else if (menu === 'consultas') {
      this.consultasMenuOpen = !this.consultasMenuOpen;
    }
  }

  listado_paquetes() {
    this.router.navigate(['paquete/listado']);
  }

  agenda() {
    this.router.navigate(['']);
  }

  listado_especialidadaes() {
    this.router.navigate(['especialidad/listado']);
  }

  listado_servicios() {
    this.router.navigate(['servicio/listado']);
  }

  alta_consulta() {
    this.router.navigate(['consulta/nueva']);
  }

  alta_paciente() {
    this.router.navigate(['paciente/nuevo']);
  }

  listado_pacientes() {
    this.router.navigate(['paciente/listado']);
  }

  listado_medicos() {
    this.router.navigate(['medico/listado']);
  }

  alta_medico() {
    this.router.navigate(['medico/nuevo']);
  }

  listado_obra_social() {
    this.router.navigate(['obra-social/listado']);
  }

  alta_turnos() {
    this.router.navigate(['turno/nuevo']);
  }

  facturacion() {
    this.router.navigate(['facturacion']);
  }

  login() {
    this.router.navigate(['login']);
  }

  logout() {
    this.auth.logout();
  }
}
