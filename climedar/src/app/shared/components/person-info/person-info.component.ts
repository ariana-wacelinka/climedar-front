import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CenteredCardComponent } from "../centered-card/centered-card.component";
import { Paciente } from '../../../patients/models/paciente.models';
import { Doctor } from '../../../doctors/models/doctor.models';
import { Consultation } from '../../../consultation/models/consultation.model';
import { ConsultationService } from '../../../consultation/services/consultation.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-person-info',
  imports: [
      CenteredCardComponent,
      MatButtonModule,
      MatTableModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatMenuModule,
      MatSortModule,
      MatPaginatorModule
  ],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.scss'
})
export class PersonInfoComponent {
  paciente = signal<Paciente | null>(null);
  doctor = signal<Doctor | null>(null);
  person = signal<Paciente | Doctor | null>(null);
  consultas = signal<Consultation[]>([]);
  displayedColumns: string[] = ["date", "timeStart", "person"];

  constructor(private router: Router,
    private consultationService: ConsultationService
  ) {
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

  ngOnInit() {
    if (this.doctor()?.speciality) {
      this.consultationService.getConsultasByDoctorId(1, this.doctor()?.id || "").subscribe(consultas => {
        this.consultas.set(consultas);
      });
    } else {
      this.consultationService.getConsultasByPatientId(1, this.paciente()?.id || "").subscribe(consultas => {
        this.consultas.set(consultas);
      });
    }
  }
}
