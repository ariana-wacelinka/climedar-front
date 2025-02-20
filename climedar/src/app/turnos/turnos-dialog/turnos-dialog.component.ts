import { PageInfo } from './../../shared/models/extras.models';
import { ChangeDetectorRef, Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Turno, TurnoState } from '../models/turno.models';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTimepickerModule, MatTimepickerSelected } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Especialidad, EspecialidadService } from '../../especialidad';
import { Doctor } from '../../doctors/models/doctor.models';
import { startWith, filter, debounceTime, switchMap, map, Observable } from 'rxjs';
import { DoctorService } from '../../doctors/service/doctor.service';
import { TurnosService } from '../services/turnos-service/turnos.service';
import { Duration } from 'luxon';
import { BrowserModule } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos-dialog',
  imports: [
    MatDialogModule,
    MatCardModule,
    NgIf,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatInputModule,
    MatTimepickerModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    PaginatorComponent,
    MatMenuModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './turnos-dialog.component.html',
  styleUrl: './turnos-dialog.component.scss'
})
export class TurnosDialogComponent implements OnInit {
  consulta: any | null = null;
  especialidadControl = new FormControl<String | Especialidad>('');
  doctorControl = new FormControl<String | Doctor>('');
  turnos = signal<Turno[]>([]);
  fecha: string;
  startTime: string;
  endTime: string;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  filteredEspecialidadOptions: Observable<Especialidad[]> | undefined;
  filteredDoctorOptions: Observable<Doctor[]> | undefined;

  constructor(
    private especialidadService: EspecialidadService,
    private doctorService: DoctorService,
    private turnosService: TurnosService,
    public dialogRef: MatDialogRef<TurnosDialogComponent>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { fechaFormat: string; especialidad: Especialidad; doctor: Doctor, consulta: any | null }
  ) {
    this.consulta = data.consulta;
    console.log('data', data);
    this.fecha = data.fechaFormat;
    this.startTime = "";
    this.endTime = "";
    this.especialidadControl.setValue(data.especialidad);
    this.doctorControl.setValue(data.doctor);
    if (this.consulta) {
      this.doctorControl.disable();
      this.especialidadControl.disable();
    }
    console.log('thisStartTime', this.startTime);
    console.log('thisEndTime', this.endTime);
    if (data.doctor) {
      this.turnosService.getTurnosByDate(this.fecha, data.doctor.id, '', '', this.pageInfo().currentPage).pipe(
        map(response => response)
      ).subscribe(response => {
        this.turnos.set(response.shifts);
        this.pageInfo.set(response.pageInfo);
      });
    }
  }

  async ngOnInit() {

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
        const especialidadId = typeof especialidad === 'string' || especialidad == '' || especialidad == null ? '' : (especialidad as Especialidad).id;
        return this.doctorService.getDoctorsByName(title, especialidadId!).pipe(
          map((doctors: Doctor[]) => {
            return doctors;
          })
        );
      }),
    );

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
    this.pageInfo.set({ totalItems: 0, currentPage: 1, totalPages: 0 });
    console.log('selected', event.option.value);
    this.doctorControl.setValue(event.option.value);
    console.log("fecha", this.fecha);
    var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    this.turnosService.getTurnosByDate(this.fecha, (event.option.value as Doctor).id, startTime, endTime, this.pageInfo().currentPage).pipe(
      map(response => response)
    ).subscribe(response => {
      this.turnos.set(response.shifts);
      this.pageInfo.set(response.pageInfo);
    });
    console.log('turnos', this.turnos());
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
    //filtrado de medicos por especialidad y busqueda de turnos
    console.log('selected', event.option.value);
    this.especialidadControl.setValue(event.option.value);
    this.doctorControl.setValue('');
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  onSelectedTime(event: MatTimepickerSelected<Date>) {
    this.pageInfo.set({ totalItems: 0, currentPage: 1, totalPages: 0 });
    var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    if (typeof this.doctorControl.value === 'string' || this.doctorControl.value === '' || this.doctorControl.value == null) {
      this.turnosService.getTurnosByDate(this.fecha, "", startTime, endTime, this.pageInfo().currentPage).pipe(
        map(response => response)
      ).subscribe(response => {
        this.turnos.set(response.shifts);
        this.pageInfo.set(response.pageInfo);
      });
      return;
    }
    console.log('selectedTime', event);
    this.turnosService.getTurnosByDate(this.fecha, (this.doctorControl.value as Doctor).id, startTime, endTime, this.pageInfo().currentPage).pipe(
      map(response => response)
    ).subscribe(response => {
      this.turnos.set(response.shifts);
      this.pageInfo.set(response.pageInfo);
    });

  }

  pageChange(page: number) {
    var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
    if (typeof this.doctorControl.value === 'string' || this.doctorControl.value === '' || this.doctorControl.value == null) {
      this.turnosService.getTurnosByDate(this.fecha, "", startTime, endTime, page).pipe(
        map(response => response)
      ).subscribe(response => {
        this.turnos.set(response.shifts);
        this.pageInfo.set(response.pageInfo);
      });
      return;
    } else {
      this.turnosService.getTurnosByDate(this.fecha, (this.doctorControl.value as Doctor).id, startTime, endTime, page).pipe(
        map(response => response)
      ).subscribe(response => {
        this.turnos.set(response.shifts);
        this.pageInfo.set(response.pageInfo);
        console.log("pageInfo", this.pageInfo);
      });
    }
  }

  goToCreateConsulta(turno: Turno) {
    this.dialogRef.close();
    if (this.consulta) {
      this.router.navigate(['consulta/nueva'], { state: { consultaData: this.consulta, turno: turno } });
      return;
    }
    this.router.navigate(['consulta/nueva'], { state: { turnoId: turno.id} });
  }

  isTunoOcuped(turno: Turno): boolean {
    return turno.state === TurnoState.OCUPADO;
  }

  isTurnoAvailable(turno: Turno): boolean {
    return turno.state === TurnoState.LIBRE;
  }

  isTurnoCanceled(turno: Turno): boolean {
    return turno.state === TurnoState.CANCELADO;
  }

  cancelShift(turno: Turno) {
    this.turnosService.cancelShift(turno.id!).subscribe((response) => {
      console.log('cancelShift', response.state);
      this.turnos().filter(t => t.id == turno.id).map(t => t.state = response.state);
      const turnoElement = document.getElementById(turno.id!.toString());
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    });
  }

  deleteShift(turno: Turno) {
    this.turnosService.deleteShift(turno.id!).subscribe((response) => {
      console.log('deleteShift', response);
      if (response) {
        console.log("doctor", this.doctorControl.value);
        var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
        var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
        this.turnosService.getTurnosByDate(this.fecha, (this.doctorControl.value as Doctor).id, startTime, endTime, this.pageInfo().currentPage).pipe(
          map(response => response)
        ).subscribe(response => {
          console.log('response', response);
          this.turnos.set(response.shifts);
          this.pageInfo.set(response.pageInfo);
        });
      } else {
        alert('Error al eliminar turno');
      }
    });
  }

  liberarTurno(turno: Turno) {
    alert('liberar turno');
  }

  modificarTurno(turno: Turno) {
    alert('Modificar turno');
  }

  convertDuration(duration: string): string {
    return Duration.fromISO(duration).as('minutes') + ' min';
  }

}
