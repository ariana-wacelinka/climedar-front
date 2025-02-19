import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CenteredCardComponent } from "../centered-card/centered-card.component";
import { Paciente } from '../../../patients/models/paciente.models';
import { Doctor } from '../../../doctors/models/doctor.models';

@Component({
  selector: 'app-person-info',
  imports: [CenteredCardComponent],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.scss'
})
export class PersonInfoComponent {
  paciente = signal<Paciente | null>(null);
  doctor = signal<Doctor | null>(null);
  person = signal<Paciente | Doctor | null>(null);

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state);
    if (navigation?.extras.state?.['pacienteInfo']) {
      this.person.set(navigation?.extras.state?.['pacienteInfo']);
      this.paciente.set(navigation?.extras.state?.['pacienteInfo']);
    } else if (navigation?.extras.state?.['doctorInfo']) {
      this.person.set(navigation?.extras.state?.['doctorInfo']);
      this.doctor.set(navigation?.extras.state?.['doctorInfo']);
    }
  }
}
