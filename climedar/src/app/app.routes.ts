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

export const routes: Routes = [
  { path: '', component: CalendarComponent },
  { path: 'home', component: CenteredCardComponent },
  { path: 'consulta/nueva', component: CreateConsultationComponent },
  { path: 'consulta/nueva/:turnoId', component: CreateConsultationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'medico/nuevo', component: AltaDoctorComponent },
  { path: 'medico/editar', component: AltaDoctorComponent },
  { path: 'paciente/nuevo', component: AltaPatientsComponent },
  { path: 'paciente/editar', component: AltaPatientsComponent },
  { path: 'turno/nuevo', component: AltaTurnoComponent },
  { path: 'medico/listado', component: ListadoDoctoresComponent },
  { path: 'obra-social/listado', component: ListadoObrasSocialesComponent },
  { path: 'especialidad/listado', component: ListadoEspecialidadesComponent },
  { path: 'servicio/listado', component: ListadoServiciosComponent },
  { path: 'paquete/listado', component: ListadoPaquetesComponent },
  { path: 'paciente/listado', component: ListadoPacientesComponent },
  { path: 'paginator', component: PaginatorComponent },
  { path: 'medico/info', component: PersonInfoComponent },
  { path: 'paciente/info', component: PersonInfoComponent },
  { path: 'facturacion', component: FacturacionComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
