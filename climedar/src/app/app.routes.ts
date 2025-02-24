import { Routes } from '@angular/router';
import { CenteredCardComponent } from './shared/components/centered-card/centered-card.component';
import { LoginComponent } from './auth/login/login.component';
import { AltaDoctorComponent } from './doctors/alta-doctor/alta-doctor.component';
import { AltaPatientsComponent } from './patients/alta-patients/alta-patients.component';
import { CalendarComponent } from './turnos/calendar/calendar.component';
import { ListadoObrasSocialesComponent } from './obra-social/listado-obras-sociales/listado-obras-sociales.component';
import { PaginatorComponent } from './shared/components/paginator/paginator.component';
import { ListadoEspecialidadesComponent } from './especialidad/listado-especialidades/listado-especialidades.component';
import { ListadoServiciosComponent } from './servicio/listado-servicios/listado-servicios.component';
import { ListadoPaquetesComponent } from './paquetes/listado-paquetes/listado-paquetes.component';
import { CreateConsultationComponent } from './consultation/create-consultation/create-consultation.component';
import { AltaTurnoComponent } from './turnos/alta-turno/alta-turno.component';
import { ListadoPacientesComponent } from './patients/listado-pacientes/listado-pacientes.component';
import { ListadoDoctoresComponent } from './doctors/listado-doctores/listado-doctores.component';
import { PersonInfoComponent } from './shared/components/person-info/person-info.component';
import { FacturacionComponent } from './facturacion/facturacion/facturacion.component';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', component: CalendarComponent, canActivate: [authGuard] },
  { path: 'home', component: CenteredCardComponent },
  { path: 'consulta/nueva', component: CreateConsultationComponent , canActivate: [authGuard]},
  { path: 'consulta/editar', component: CreateConsultationComponent , canActivate: [authGuard]},
  { path: 'consulta/nueva/:turnoId', component: CreateConsultationComponent , canActivate: [authGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'medico/nuevo', component: AltaDoctorComponent , canActivate: [authGuard]},
  { path: 'medico/editar', component: AltaDoctorComponent , canActivate: [authGuard]},
  { path: 'paciente/nuevo', component: AltaPatientsComponent , canActivate: [authGuard]},
  { path: 'paciente/editar', component: AltaPatientsComponent , canActivate: [authGuard]},
  { path: 'turno/nuevo', component: AltaTurnoComponent , canActivate: [authGuard]},
  { path: 'medico/listado', component: ListadoDoctoresComponent , canActivate: [authGuard]},
  { path: 'obra-social/listado', component: ListadoObrasSocialesComponent , canActivate: [authGuard]},
  { path: 'especialidad/listado', component: ListadoEspecialidadesComponent , canActivate: [authGuard]},
  { path: 'servicio/listado', component: ListadoServiciosComponent , canActivate: [authGuard]},
  { path: 'paquete/listado', component: ListadoPaquetesComponent , canActivate: [authGuard]},
  { path: 'paciente/listado', component: ListadoPacientesComponent , canActivate: [authGuard]},
  { path: 'paginator', component: PaginatorComponent , canActivate: [authGuard]},
  { path: 'medico/info', component: PersonInfoComponent , canActivate: [authGuard]},
  { path: 'paciente/info', component: PersonInfoComponent , canActivate: [authGuard]},
  { path: 'facturacion', component: FacturacionComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: 'login', pathMatch: 'full'}
];
