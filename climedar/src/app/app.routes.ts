import { Routes } from '@angular/router';
import { CenteredCardComponent } from './shared/components/centered-card/centered-card.component';
import { LoginComponent } from './auth/login/login.component';
import { AltaDoctorComponent } from './doctors/alta-doctor/alta-doctor.component';
import { AltaPatientsComponent } from './patients/alta-patients/alta-patients.component';
import { CalendarComponent } from './turnos/calendar/calendar.component';

export const routes: Routes = [
    {path: '', component: CalendarComponent},
    {path: 'home', component: CenteredCardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'doctor/nuevo', component: AltaDoctorComponent},
    {path: 'paciente/nuevo', component: AltaPatientsComponent}
];
