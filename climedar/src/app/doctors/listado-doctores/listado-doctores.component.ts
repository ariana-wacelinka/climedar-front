import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CenteredCardComponent } from '../../shared/components';
import { MatTableModule } from '@angular/material/table';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Doctor } from '../models/doctor.models';
import { DoctorService } from '../service/doctor.service';
import { Router } from '@angular/router';
import { PageInfo } from '../../shared/models/extras.models';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

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
    MatInputModule,
    LoaderComponent
  ],
  templateUrl: './listado-doctores.component.html',
  styleUrl: './listado-doctores.component.scss'
})
export class ListadoDoctoresComponent {
  isLoading = true;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["name", "surname", "dni", "edit"];
  doctors = signal<Doctor[]>([]);
  filterValue = signal<string>('');

  constructor(private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.loadDoctors(1);
  }

  loadDoctors(page: number) {
    this.doctorService.getAllDoctors(page).subscribe(response => {
      this.doctors.set(response.doctors);
      this.pageInfo.set(response.pageInfo);
      this.isLoading = false;
    });
  }

  createDoctor() {
    this.router.navigate(['/medico/nuevo']);
  }

  editDoctor(id: number) {
    this.router.navigate(['/medico/editar'],
      { state: { id } }
    );
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      console.log('Médico eliminado');
    });
    this.applyFilter(new Event(''));
  }

  doctorInfo(doctor: Doctor) {
    this.doctorService.getDoctorById(doctor.id).subscribe(response => {
      this.router.navigate(['/medico/info'],
        { state: { doctorInfo: response } }
      );
    });
  }

  applyFilter(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value.trim().toLowerCase());
    this.doctorService.getDoctorsFiltro(this.pageInfo().currentPage, this.filterValue()).subscribe((response) => {
      this.doctors.set(response.doctors);
      this.pageInfo.set(response.pageInfo);
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.doctorService.getDoctorsFiltro(page, this.filterValue()).subscribe(response => {
      this.doctors.set(response.doctors);
      this.pageInfo.set(response.pageInfo);
    });
  }

  volver() {
    window.history.back();
  }
}
