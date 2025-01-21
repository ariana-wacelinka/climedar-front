import { Routes } from '@angular/router';
import { CenteredCardComponent } from './shared/components/centered-card/centered-card.component';

export const routes: Routes = [
    {path: '', component: CenteredCardComponent},
    {path: 'home', component: CenteredCardComponent}
];
