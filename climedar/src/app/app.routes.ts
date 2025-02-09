import { Routes } from '@angular/router';
import { CenteredCardComponent } from './shared/components/centered-card/centered-card.component';
import { LoginComponent } from './auth/login/login.component';
import { AltaDoctorComponent } from './doctors/alta-doctor/alta-doctor.component';
import { AltaPatientsComponent } from './patients/alta-patients/alta-patients.component';
import { CalendarComponent } from './turnos/calendar/calendar.component';
import {ListadoObrasSocialesComponent} from './obra-social/listado-obras-sociales/listado-obras-sociales.component';
import {PaginatorComponent} from './shared/components/paginator/paginator.component';
import {ListadoEspecialidadesComponent} from './especialidad/listado-especialidades/listado-especialidades.component';
import {ListadoServiciosComponent} from './servicio/listado-servicios/listado-servicios.component';
import {ListadoPaquetesComponent} from './paquetes/listado-paquetes/listado-paquetes.component';
import { CreateConsultationComponent } from './consultation/create-consultation/create-consultation.component';

export const routes: Routes = [
  { path: '', component: CalendarComponent },
  { path: 'home', component: CenteredCardComponent },
  { path: 'consultation/create', component: CreateConsultationComponent },
  { path: 'consultation/create/:turnoId', component: CreateConsultationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'doctor/nuevo', component: AltaDoctorComponent },
  { path: 'paciente/nuevo', component: AltaPatientsComponent },
  { path: 'obra-social/listado', component: ListadoObrasSocialesComponent },
  { path: 'especialidad/listado', component: ListadoEspecialidadesComponent },
  { path: 'servicio/listado', component: ListadoServiciosComponent },
  { path: 'paquetes/listado', component: ListadoPaquetesComponent },
  { path: 'paginator', component: PaginatorComponent },
];
