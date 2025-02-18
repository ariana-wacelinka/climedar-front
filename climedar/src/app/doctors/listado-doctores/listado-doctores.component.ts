import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CenteredCardComponent } from '../../shared/components';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Doctor } from '../models/doctor.models';
import { DoctorService } from '../service/doctor.service';
import { Router } from '@angular/router';
import { PageInfo } from '../../shared/models/extras.models';

@Component({
  selector: 'app-listado-doctores',
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
  templateUrl: './listado-doctores.component.html',
  styleUrl: './listado-doctores.component.scss'
})
export class ListadoDoctoresComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["name", "surname", "dni", "edit"];
  dataSource = new MatTableDataSource<Doctor>();
  doctors = signal<Doctor[]>([]);

  constructor(private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.doctorService.getAllDoctors(1).subscribe(response => {
      this.doctors.set(response.doctors);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.doctors()
    });
  }

  createDoctor() {
    this.router.navigate(['/doctor/nuevo']);
  }

  editDoctor(id: number) {
    this.router.navigate(['/doctor/editar'],
      { state: { id } }
    );
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      console.log('Doctor eliminado');
    });
    window.location.reload();
  }

  doctorInfo(doctor: Doctor) {
    console.log('Información de doctor', doctor);
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.doctorService.getAllDoctors(page).subscribe(response => {
      this.doctors.set(response.doctors);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.doctors()
    });
  }
}
