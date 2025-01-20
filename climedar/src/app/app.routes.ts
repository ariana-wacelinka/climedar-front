import { Routes } from '@angular/router';
import { CenteredCardComponent } from './layout/centered-card/centered-card.component';

export const routes: Routes = [
    {path: '', component: CenteredCardComponent},
    {path: 'home', component: CenteredCardComponent}
];
