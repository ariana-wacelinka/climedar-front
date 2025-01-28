import { Routes } from '@angular/router';
import { CenteredCardComponent } from './shared/components/centered-card/centered-card.component';
import { LoginComponent } from './auth/login/login.component';
import { AltaDoctorComponent } from './doctors/alta-doctor/alta-doctor.component';
import {ObraSocialComponent} from './obra-social/obra-social.component';

export const routes: Routes = [
    {path: '', component: CenteredCardComponent},
    {path: 'home', component: CenteredCardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'doctor/nuevo', component: AltaDoctorComponent},
    {path: 'obra-social/listado', component: ObraSocialComponent}
];
