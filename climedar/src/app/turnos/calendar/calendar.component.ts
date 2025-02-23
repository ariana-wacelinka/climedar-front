import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TurnosService } from '../services/turnos-service/turnos.service';
import { TurnosDialogComponent } from '../turnos-dialog/turnos-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Especialidad } from '../../especialidad';
import { Doctor } from '../../doctors/models/doctor.models';
import { EspecialidadService } from '../../especialidad/service/especialidad.service';
import {MatInputModule} from '@angular/material/input';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    DatePipe,
    CenteredCardComponent,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgFor,
    MatInputModule
],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  currentDate = new Date();
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  monthDays: Date[] = [];
  firstEmptyDays: number[] = [];
  lastEmptyDays: number[] = [];
  especialidades: Especialidad[] = [];
  medicos: Doctor[] = [];
  filteredEspecialidadOptions:  Observable<Especialidad[]> | undefined;
  filteredDoctorOptions:  Observable<Doctor[]> | undefined;
  dayswithShifts: Date[] = [];
  especialidadControl = new FormControl<String | Especialidad>('');
  doctorControl = new FormControl<String | Doctor>('');
  consultaDatos: any | null = null;

  constructor(
    private especialidadService: EspecialidadService,
    private turnosService: TurnosService,
    private dialog: MatDialog,
    private doctorService: DoctorService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.consultaDatos = navigation?.extras?.state?.['data'] || null;
    if (this.consultaDatos) {
      this.doctorControl.setValue(this.consultaDatos.doctor);
      this.especialidadControl.setValue(this.consultaDatos.doctor.speciality);
      this.doctorControl.disable();
      this.especialidadControl.disable();
    }
    console.log('this.consultaDatos', this.consultaDatos);
    console.log('this.filteredEspecialidadOptions', this.filteredEspecialidadOptions);
  }

  async ngOnInit() {
    this.updateCalendar();

    this.filteredEspecialidadOptions = this.especialidadControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.especialidadService.getEspecialidadesByNombre(title).pipe(
          map((especiliades: Especialidad[]) => {
            return especiliades;
          })
        );
      }),
    );

    this.filteredDoctorOptions = this.doctorControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        const especialidad = this.especialidadControl.value;
        const especialidadId = typeof especialidad === 'string' || especialidad === '' ? '' : (especialidad as Especialidad).id;
        return this.doctorService.getDoctorsByName(title, especialidadId!).pipe(
          map((doctors: Doctor[]) => {
            return doctors;
          })
        );
      }),
    );

  }

  trackByCodigo(index: number, option: Especialidad): string {
    return option.code!;
  }

  updateCalendar() {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  
    // Generar los días del mes
    this.monthDays = Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i + 1)
    );
  
    // Días vacíos al inicio
    const firstDayOfWeek = firstDay.getDay() || 7; // Ajustar inicio para lunes
    this.firstEmptyDays = Array(firstDayOfWeek - 1).fill(0);
    this.lastEmptyDays = Array((7 - ((this.monthDays.length + this.firstEmptyDays.length) % 7))%7).fill(0);
    console.log('lastEmptyDays', this.lastEmptyDays);
  }
  

  changeMonth(direction: 'prev' | 'next') {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + (direction === 'prev' ? -1 : 1),
      1
    );
    this.updateCalendar();
    if (this.doctorControl.value !== '' && this.doctorControl.value !== null && typeof this.doctorControl.value !== 'string') {
      this.turnosService.getDaysWithShiftsByMonth(this.currentDate, (this.doctorControl.value as Doctor).id).subscribe((days: Date[]) => {
        this.dayswithShifts = days;
      });
    }
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  tieneTurnos(fecha: Date): boolean {
    return this.dayswithShifts.some(day => day.toISOString().split('T')[0] === fecha.toISOString().split('T')[0]);
  }

  openTurnosDialog(fecha: Date) {
    // const turnos = this.turnosService.getTurnosDelDia(fecha);
    const consulta = this.consultaDatos;
    const fechaFormat = fecha.toISOString().split('T')[0];
    console.log('openTurnosDialog', fecha.toISOString());
    const especialidad = typeof this.especialidadControl.value === 'string' || this.especialidadControl.value === '' ? null : this.especialidadControl.value as Especialidad;
    const doctor = typeof this.doctorControl.value === 'string' || this.doctorControl.value === '' ? null : this.doctorControl.value as Doctor;
    this.dialog.open(TurnosDialogComponent, {
      data: { fechaFormat , especialidad, doctor, consulta },
      width: '600px',
      maxWidth: '90vw',
      height: '90vh'
    });
  }

  displayEspecialidad(especialidad: Especialidad | null): string {
    return especialidad ? especialidad.name! : '';
  }

  displayDoctor(doctor: Doctor | null): string {
    return doctor 
      ? doctor.gender == "MALE"
        ? `Dr. ${doctor.surname} ${doctor.name}`
        : `Dra. ${doctor.surname} ${doctor.name}`
      : '';
  }

  selectedDoctor(event: MatAutocompleteSelectedEvent) {
    //filtrado de medicos por especialidad y busqueda de turnos
    console.log('selected', event.option.value);
    this.doctorControl.setValue(event.option.value);
    console.log("currentDate", this.currentDate);
    this.turnosService.getDaysWithShiftsByMonth(this.currentDate, (event.option.value as Doctor).id).subscribe((days: Date[]) => {
      this.dayswithShifts = days;
    });
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
    //filtrado de medicos por especialidad y busqueda de turnos
    console.log('selected', event.option.value);
    this.especialidadControl.setValue(event.option.value);
    this.doctorControl.setValue('');
  }

}
