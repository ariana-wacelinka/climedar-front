import { TurnosService } from './../../turnos/services/turnos-service/turnos.service';
import { Component, OnInit, signal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, DatePipe, AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgModel, FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MedicalPackage, MedicalService, Services } from '../../servicio/models/services.models';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Turno } from '../../turnos/models/turno.models';
import { BrowserModule } from '@angular/platform-browser';
import { Doctor } from '../../doctors/models/doctor.models';
import { Especialidad } from '../../especialidad';
import { Observable, startWith, filter, debounceTime, switchMap, map } from 'rxjs';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Paciente } from '../../patients/models/paciente.models';

@Component({
  selector: 'app-create-consultation',
  imports: [
    CenteredCardComponent,
    MatDialogModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTabsModule,
    AsyncPipe,
    MatInputModule,
    MatTimepickerModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    PaginatorComponent,
    CurrencyPipe,
    MatMenuModule
  ],
  providers: [DatePipe, provideNativeDateAdapter()],
  templateUrl: './create-consultation.component.html',
  styleUrl: './create-consultation.component.scss'
})
export class CreateConsultationComponent implements OnInit {
  consultationFG = new FormGroup({
    patientId: new FormControl<string>(""),
    shiftId: new FormControl<string>(""),
    description: new FormControl<string>(""),
    observation: new FormControl<string>(""),
    servicesSelected: new FormControl<number[]>([]), //pueden ser servicios o paquetes (se guarda el id)
  })
  turno = new FormGroup({
    id: new FormControl<string>(""),
    date: new FormControl<Date>(new Date()),
    startTime: new FormControl<Date>(new Date()),
    endTime: new FormControl<Date>(new Date()),
  });
  doctor = new FormGroup({
    id: new FormControl<string>(""),
    name: new FormControl<string>(""),
    surname: new FormControl<string>(""),
    gender: new FormControl<string>(""),
  });
  speciality = new FormGroup({
    id: new FormControl<string>(""),
    name: new FormControl<string>("")
  })
  servicios = signal<MedicalService[]>([]);
  paquetes = signal<MedicalPackage[]>([]);
  turnoId = signal<string | null>(null);
  doctorControl = new FormControl<Doctor | string>("");
  pacienteControl = new FormControl<string | string>("");
  filteredPatientOptions: Observable<Doctor[]> | undefined;
  filteredDoctorOptions: Observable<Doctor[]> | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private turnosService: TurnosService, private doctorService: DoctorService) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('turnoId');
      if (id) {
        // Almacena el valor en la señal antes de cambiar la URL
        this.turnoId.set(id);

        // Cambia la URL sin recargar ni reiniciar el componente
        this.router.navigate(['/consultation/create'], { replaceUrl: true });
      }

      console.log('turnoId ' + this.turnoId());

    });
  }

  ngOnInit(): void {
    if (this.isFromShift()) {
      this.getShift();
    }

    this.filteredDoctorOptions = this.doctorControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.doctorService.getDoctorsByName(title, "").pipe(
          map((doctors: Doctor[]) => {
            return doctors;
          })
        );
      }),
    );
  }

  isFromShift(): boolean {
    return !!this.turnoId();
  }

  getShift(): void {
    this.turnosService.getShiftById(this.turnoId()!).subscribe(turno => {
      console.log('turno', turno);
      console.log("date", turno.date, "Date", new Date(turno.date + 'T00:00:00'));
      this.turno.patchValue({
        id: turno.id,
        date: turno.date ? new Date(turno.date + 'T00:00:00') : null,
        startTime: turno.startTime ? new Date(new Date(this.turno.controls.date.value!).setHours(parseInt(turno.startTime.split(":")[0]), parseInt(turno.startTime.split(":")[1]))) : null,
        endTime: turno.endTime ? new Date(new Date(this.turno.controls.date.value!).setHours(parseInt(turno.endTime.split(":")[0]), parseInt(turno.endTime.split(":")[1]))) : null,
      });
      this.doctor.setValue({
        id: turno["doctor"]!.id,
        name: turno["doctor"]!.name,
        surname: turno["doctor"]!.surname,
        gender: turno["doctor"]!.gender,
      });
      this.speciality.setValue({
        id: turno["doctor"]!["speciality"]!.id ?? '',
        name: turno["doctor"]!["speciality"]!.name ?? ''
      });
      this.doctorControl.setValue((turno.doctor!) as Doctor);
      console.log('turno', this.turno.value);
      console.log('doctor', this.doctor.value);
      console.log('speciality', this.speciality.value);
      this.doctorControl.disable();
    });
    this.turno.disable();
  }

  selectedDoctor(event: MatAutocompleteSelectedEvent) {
    this.doctorControl.setValue(event.option.value);
  }

  displayDoctor(doctor: Doctor | null): string {
    return doctor
      ? doctor.gender == "MALE"
        ? `Dr. ${doctor.surname} ${doctor.name}`
        : `Dra. ${doctor.surname} ${doctor.name}`
      : '';
  }

  selectedPatient(event: MatAutocompleteSelectedEvent) {
    this.pacienteControl.setValue(event.option.value);
  }

  displayPatient(paciente: Paciente | null): string {
    return paciente ? `${paciente.surname} ${paciente.name}` : '';
  }

}
