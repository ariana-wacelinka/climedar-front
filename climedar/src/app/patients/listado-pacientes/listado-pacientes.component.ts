import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Paciente } from '../models/paciente.models';
import { PageInfo } from '../../shared/models/extras.models';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-listado-pacientes',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    CenteredCardComponent,
    MatTableModule,
    PaginatorComponent,
    MatButtonModule,
    MatLabel,
    MatInputModule
  ],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.scss'
})
export class ListadoPacientesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["name", "surname", "dni", "edit"];
  dataSource = new MatTableDataSource<Paciente>();
  pacientes = signal<Paciente[]>([]);

  constructor(private router: Router,
    private pacienteService: PatientService
  ) { }

  ngOnInit() {
    this.pacienteService.getAllPatients(1).subscribe(response => {
      this.pacientes.set(response.patients);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.pacientes()
    });
  }

  createPaciente() {
    this.router.navigate(['/paciente/nuevo']);
  }

  editPaciente(id: number) {
    this.router.navigate(['/paciente/editar'],
      { state: { id } }
    );
  }

  deletePaciente(id: number) {
    this.pacienteService.deletePatient(id).subscribe(() => { });
    window.location.reload();
  }

  pacienteInfo(paciente: Paciente) {
    this.pacienteService.getPatientById(paciente.id).subscribe
      (response => {
        const pacienteInfo = response
        this.router.navigate(['/paciente/info'],
          { state: { pacienteInfo: response } }
        );
      });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.pacienteService.getAllPatients(page).subscribe(response => {
      this.pacientes.set(response.patients);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.pacientes()
    });
  }
}
