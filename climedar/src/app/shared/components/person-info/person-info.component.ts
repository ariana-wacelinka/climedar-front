import { Component, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CenteredCardComponent } from "../centered-card/centered-card.component";
import { Paciente } from '../../../patients/models/paciente.models';
import { Doctor } from '../../../doctors/models/doctor.models';
import { ConsultationResponse } from '../../../consultation/models/consultation.model';
import { ConsultationService } from '../../../consultation/services/consultation.service';
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from '../paginator/paginator.component';
import { PageInfo } from '../../models/extras.models';
import { DoctorService } from '../../../doctors/service/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';

@Component({
  selector: 'app-person-info',
  imports: [
    CenteredCardComponent,
    MatTableModule,
    PaginatorComponent
  ],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.scss'
})
export class PersonInfoComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  paciente = signal<Paciente | null>(null);
  doctor = signal<Doctor | null>(null);
  person = signal<Paciente | Doctor | null>(null);

  consultas = signal<ConsultationResponse[]>([]);
  displayedColumns: string[] = ["date", "timeStart", "person"];

  constructor(private router: Router,
    private consultationService: ConsultationService,
    private doctorService: DoctorService,
    private patientService: PatientService) {
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
    this.getConsultas(1);
  }

  getConsultas(page: number) {
    if (this.doctor()?.speciality) {
      this.getConsultasParaDoctor(page);
    } else {
      this.getConsultasParaPaciente(page);
    }
  }

  getConsultasParaDoctor(page: number) {
    this.consultationService.getConsultasByDoctorId(page, this.doctor()?.id || "").subscribe(consultas => {
      this.consultas.set(consultas.consultations);
      this.pageInfo.set(consultas.pageInfo);

      const currentConsultas = this.consultas();
      for (let i = 0; i < currentConsultas.length; i++) {
        const patientId = currentConsultas[i].patient!.id;
        this.patientService.getPatientById(patientId).subscribe(paciente => {
          const origConsultas = this.consultas();
          const origPatient = currentConsultas[i].patient!;
          const updatedPatient = {
            id: origPatient.id,
            name: paciente.name,
            surname: paciente.surname
          };
          const updatedConsultas = origConsultas.map((consulta, index) =>
            index === i ? { ...consulta, patient: updatedPatient } : consulta
          );
          this.consultas.set(updatedConsultas);
        });
      }
    });
  }

  getConsultasParaPaciente(page: number) {
    this.consultationService.getConsultasByPatientId(page, this.paciente()?.id || "").subscribe(consultas => {
      this.consultas.set(consultas.consultations);
      this.pageInfo.set(consultas.pageInfo);

      const currentConsultas = this.consultas();
      for (let i = 0; i < currentConsultas.length; i++) {
        const doctorId = currentConsultas[i].doctor!.id;
        this.doctorService.getDoctorById(doctorId).subscribe(doctor => {
          const origConsultas = this.consultas();
          const origDoctor = currentConsultas[i].doctor!;
          const updatedDoctor = {
            id: origDoctor.id,
            name: doctor.name,
            surname: doctor.surname
          };
          const updatedConsultas = origConsultas.map((consulta, index) =>
            index === i ? { ...consulta, doctor: updatedDoctor } : consulta
          );
          this.consultas.set(updatedConsultas);
        });
      }
    });
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });
    this.getConsultas(page);
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }
}
