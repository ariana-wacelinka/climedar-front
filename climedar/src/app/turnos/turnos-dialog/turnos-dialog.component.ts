import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Turno } from '../models/turno.models';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatTimepickerModule, MatTimepickerSelected} from '@angular/material/timepicker';
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './turnos-dialog.component.html',
  styleUrl: './turnos-dialog.component.scss'
})
export class TurnosDialogComponent implements OnInit {
  especialidadControl = new FormControl<String | Especialidad>('');
  doctorControl = new FormControl<String | Doctor>('');
  turnos = signal<Turno[]>([]);
  fecha: string;
  startTime: string;
  endTime: string;

  filteredEspecialidadOptions:  Observable<Especialidad[]> | undefined;
  filteredDoctorOptions:  Observable<Doctor[]> | undefined;
  
  constructor(
    private especialidadService: EspecialidadService,
    private doctorService: DoctorService,
    private turnosService: TurnosService,
    public dialogRef: MatDialogRef<TurnosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fechaFormat: string; especialidad: Especialidad; doctor: Doctor }
  ) {
    console.log('data', data);
    this.fecha = data.fechaFormat;
    this.startTime = "";
    this.endTime = "";
    this.especialidadControl.setValue(data.especialidad);
    this.doctorControl.setValue(data.doctor);
    console.log('thisStartTime', this.startTime);
    console.log('thisEndTime', this.endTime);
    if (data.doctor) {
      this.turnosService.getTurnosByDate(this.fecha, data.doctor.id, '08:00', '20:00', 1).pipe(
        map((turno: Turno[]) => {
          return turno;
        })
      ).subscribe(turnos => {
        this.turnos.set(turnos);
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
          return this.doctorService.getDoctorsByName(title, especialidadId).pipe(
            map((doctors: Doctor[]) => {
              return doctors;
            })
          );
        }),
      );
  
    }


    displayEspecialidad(especialidad: Especialidad | null): string {
        return especialidad ? especialidad.name : '';
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
        console.log("fecha", this.fecha);
        var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
        var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0]: "";
        this.turnosService.getTurnosByDate(this.fecha, (event.option.value as Doctor).id, startTime, endTime, 1).pipe(
          map((turno: Turno[]) => {
            return turno;
          })
        ).subscribe(turnos => {
          this.turnos.set(turnos);
        });
        console.log('turnos', this.turnos());
      }
    
      selectedEspeciality(event: MatAutocompleteSelectedEvent) {
        //filtrado de medicos por especialidad y busqueda de turnos
        console.log('selected', event.option.value);
        this.especialidadControl.setValue(event.option.value);
        this.doctorControl.setValue('');
      }

      onSelectedTime(event: MatTimepickerSelected<Date>) {
        var startTime = this.startTime != "" ? new Date(this.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0] : "";
        var endTime = this.endTime != "" ? new Date(this.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(" ")[0]: "";
        console.log("startTime", startTime);
        console.log("endTime", endTime);
        if (typeof this.doctorControl.value === 'string' || this.doctorControl.value === '' || this.doctorControl.value == null) {
          this.turnosService.getTurnosByDate(this.fecha, "", startTime, endTime, 1).pipe(
            map((turno: Turno[]) => {
              return turno;
            })
          ).subscribe(turnos => {
            this.turnos.set(turnos);
            console.log("turnos", this.turnos());
          });
          return;
        }
        console.log('selectedTime', event);
        this.turnosService.getTurnosByDate(this.fecha, (this.doctorControl.value as Doctor).id, startTime, endTime, 1).pipe(
          map((turno: Turno[]) => {
            return turno;
          })
        ).subscribe(turnos => {
          this.turnos.set(turnos);
          console.log("turnos", this.turnos());
        });

      }

      convertDuration(duration: string): string {
        return Duration.fromISO(duration).as('minutes') + ' min';
      }
    
}
