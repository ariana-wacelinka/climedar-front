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
import { MatDialog } from '@angular/material/dialog';
import { ConsultationInfoComponent } from '../../../consultation/consultation-info/consultation-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-person-info',
  imports: [
    CenteredCardComponent,
    MatTableModule,
    PaginatorComponent,
    MatButtonModule,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.scss'
})
export class PersonInfoComponent {
  isLoading = true;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  paciente = signal<Paciente | null>(null);
  doctor = signal<Doctor | null>(null);
  person = signal<Paciente | Doctor | null>(null);

  consultas = signal<ConsultationResponse[]>([]);
  displayedColumns: string[] = ["date", "timeStart", "person", "estado"];

  constructor(private router: Router,
    private consultationService: ConsultationService,
    private dialog: MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state);
    if (navigation?.extras.state?.['pacienteInfo']) {
      this.person.set(navigation?.extras.state?.['pacienteInfo']);
      this.paciente.set(navigation?.extras.state?.['pacienteInfo']);
    } else if (navigation?.extras.state?.['doctorInfo']) {
      this.person.set(navigation?.extras.state?.['doctorInfo']);
      this.doctor.set(navigation?.extras.state?.['doctorInfo']);
    }
    this.isLoading = false;
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
      console.log(consultas);
    });
  }

  getConsultasParaPaciente(page: number) {
    this.consultationService.getConsultasByPatientId(page, this.paciente()?.id || "").subscribe(consultas => {
      this.consultas.set(consultas.consultations);
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

  openConsultation(consultation: ConsultationResponse) {
    this.dialog.open(ConsultationInfoComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: { id: consultation.id }
    });
  }

  volver() {
    window.history.back();
  }
}
