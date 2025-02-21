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
    this.getConsultas(1);
    this.consultationService.getAllConsultations(1).subscribe(consultas => {
      console.log(consultas);
    });
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
      this.consultas.set(consultas.consultas);
      this.pageInfo.set(consultas.pageInfo);
    });
  }

  getConsultasParaPaciente(page: number) {
    this.consultationService.getConsultasByPatientId(page, this.paciente()?.id || "").subscribe(consultas => {
      this.consultas.set(consultas.consultas);
      this.pageInfo.set(consultas.pageInfo);
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
