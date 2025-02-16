import { TurnosService } from './../../turnos/services/turnos-service/turnos.service';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, DatePipe, AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgModel, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MedicalPackage, MedicalService, Services } from '../../servicio/models/services.models';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Turno } from '../../turnos/models/turno.models';
import { BrowserModule } from '@angular/platform-browser';
import { Doctor } from '../../doctors/models/doctor.models';
import { Especialidad } from '../../especialidad';
import { Observable, startWith, filter, debounceTime, switchMap, map } from 'rxjs';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Paciente } from '../../patients/models/paciente.models';
import { ServiciosMedicosService } from '../../servicio/services/servicio/servicios-medicos.service';
import { PageInfo } from '../../shared/models/extras.models';
import { Duration } from 'luxon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PatientService } from '../../patients/services/patient.service';
import { CreateConsultation } from '../models/consultation.model';
import { ConsultationService } from '../services/consultation.service';
import { PackageResponse } from '../../paquetes/models/package.models';
import { PaymentDialogComponent } from '../../shared/components/payment-dialog/payment-dialog.component';
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
    MatMenuModule,
    MatSlideToggleModule
  ],
  providers: [DatePipe, provideNativeDateAdapter()],
  templateUrl: './create-consultation.component.html',
  styleUrl: './create-consultation.component.scss'
})
export class CreateConsultationComponent implements OnInit {
  isSobreTurno = false;
  pago = false;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  consultationFG = new FormGroup({
    patientId: new FormControl<string>("", [Validators.required]),
    shiftId: new FormControl<string>("", [Validators.required]),
    description: new FormControl<string>(""),
    observation: new FormControl<string>(""),
    medicalServicesId: new FormControl<string[]>([], [Validators.required]), //pueden ser servicios o paquetes (se guarda el id)
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
  paquetes = signal<PackageResponse[]>([]);
  turnoId = signal<string | null>(null);
  doctorControl = new FormControl<Doctor | string>("");
  pacienteControl = new FormControl<Paciente | string>("");
  filteredPatientOptions: Observable<Doctor[]> | undefined;
  filteredDoctorOptions: Observable<Doctor[]> | undefined;
  servicioControl = new FormControl<string>("");

  constructor(private medicalService: ServiciosMedicosService, private route: ActivatedRoute, private router: Router, private turnosService: TurnosService, private doctorService: DoctorService, private pacienteService: PatientService, private consultationService: ConsultationService, private dialog: MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('turnoId') || null;
      var consultation = navigation?.extras?.state?.['consultaData'] || null;
      var turno = navigation?.extras?.state?.['turno'] || null;
      if (id) {
        // Almacena el valor en la señal antes de cambiar la URL
        this.turnoId.set(id);
        this.consultationFG.controls.shiftId.setValue(id);

        // Cambia la URL para que no se pierda el valor en caso de recarga
        this.router.navigate([], { queryParams: { turnoId: null }, queryParamsHandling: 'merge' });
      } else {
        if (consultation) {
          this.doctorControl.setValue(consultation.doctor);
          this.pacienteControl.setValue(consultation.paciente);
          this.consultationFG.controls.description.setValue(consultation.descripcion);
          this.consultationFG.controls.observation.setValue(consultation.observacion);
          this.consultationFG.controls.medicalServicesId.setValue(consultation.servicios);
          this.consultationFG.controls.shiftId.setValue(turno.id);
          console.log('consultation', consultation);
          this.turno.patchValue({
            id: turno.id,
            date: turno.date ? new Date(turno.date + 'T00:00:00') : null,
            startTime: turno.startTime ? new Date(new Date(this.turno.controls.date.value!).setHours(parseInt(turno.startTime.split(":")[0]), parseInt(turno.startTime.split(":")[1]))) : null,
            endTime: turno.endTime ? new Date(new Date(this.turno.controls.date.value!).setHours(parseInt(turno.endTime.split(":")[0]), parseInt(turno.endTime.split(":")[1]))) : null,
          });
          this.consultationFG.controls.patientId.setValue(consultation.paciente.id);
        }
      }

      console.log('turnoId ' + this.turnoId());
    });
  }

  displayTurno() {
    return this.turno.value ? this.turno.value.date?.toLocaleDateString("es-AR") + " " + this.turno.value.startTime?.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', hour12: false }) + " - " + this.turno.value.endTime?.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', hour12: false }) : "";
  }

  ngOnInit(): void {
    if (this.isFromShift()) {
      this.getShift();
    }

    this.getServices();

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

    this.filteredPatientOptions = this.pacienteControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.pacienteService.getPatients(title).pipe(
          map((paciente: Paciente[]) => {
            return paciente;
          })
        );
      }),
    );

    this.servicioControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        console.log('value', value);
        const title = value;
        console.log('doctorControl', (this.doctorControl.value as Doctor));
        if (!(this.doctorControl.value as Doctor).id) {
          return [];
        }
        return this.medicalService.getServiciosMedicos(title, (this.doctorControl.value as Doctor).speciality?.id).pipe(
          map(response => {
            console.log('response', response);
            this.servicios.set(response.services);
            this.pageInfo.set(response.pageInfo);
          })
        );
      }),
    ).subscribe();
  }

  isFromShift(): boolean {
    return !!this.turnoId();
  }

  createConsultation(): void {
    console.log('consultationFG', this.consultationFG.value);
    if (this.consultationFG.valid) {
      if (this.pago) {
        console.log('pago');
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          data: { price: this.totalAmount() }
        });
    
        dialogRef.componentInstance.paymentConfirmed.subscribe((method: string) => {
          console.log('method', method);
          console.log('consultationFG', (this.consultationFG.value as CreateConsultation));
          this.consultationService.createConsultation(this.consultationFG.value as CreateConsultation).subscribe(
            (data) => {
              console.log('data', data);
              if (data) {
                console.log("se manda el pago: ", method);

              }
            },
            (error) => {
              console.log('error', error);
            }
          );
        });
      } else {
        // console.log('no pago');
        // console.log('consultationFG', (this.consultationFG.value as CreateConsultation));
        // this.consultationService.createConsultation(this.consultationFG.value as CreateConsultation);
        }
    } else {
      console.log('invalid');
    }
  }

  getServices(name: string = "", specialityId: string = ""): void {
    this.medicalService.getServiciosMedicos(name, specialityId).subscribe((data) => {
      console.log('doctorControl', (this.doctorControl.value as Doctor));
      if ((this.doctorControl.value as Doctor).id) {
        this.servicios.set(data.services);
        this.pageInfo.set(data.pageInfo);
      }
    });
  }

  verDisp(): void {
    this.router.navigate(['/'], { state: { data: { doctor: (this.doctorControl.value as Doctor), paciente: (this.pacienteControl.value as Paciente), servicios: this.consultationFG.controls.medicalServicesId.value, descripcion: this.consultationFG.controls.description.value, observacion: this.consultationFG.controls.observation.value }, isFromConsultation: true } });
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
    this.getServices("", (event.option.value as Doctor).speciality!.id);
    if (!this.isFromShift()) {
      this.turno.patchValue({
        id: "",
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
      })
      this.consultationFG.controls.shiftId.setValue("");
      this.consultationFG.controls.medicalServicesId.setValue([]);
    }
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
    this.consultationFG.controls.patientId.setValue((event.option.value as Paciente).id);
  }

  displayPatient(paciente: Paciente | null): string {
    return paciente ? `${paciente.surname} ${paciente.name}` : '';
  }

  formatDurationTime(duration: string): string {
    return Duration.fromISO(duration).as('minutes') + ' min';
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.medicalService.getServiciosMedicos(this.servicioControl.value ?? "", "", page).subscribe((response) => {
      this.servicios.set(response.services);
      this.pageInfo.set(response.pageInfo);
    });
  }

  selectionChange(event: boolean, id: string) {
    if (event) {
      if (!this.consultationFG.controls.medicalServicesId.value!.includes(id)) {
        this.consultationFG.controls.medicalServicesId.value!.push(id);
      }
    } else {
      if (this.consultationFG.controls.medicalServicesId.value!.includes(id)) {
        this.consultationFG.controls.medicalServicesId.value!.splice(this.consultationFG.controls.medicalServicesId.value!.indexOf(id), 1);
      }
    }
  }

  isServicioSelected(id: string): boolean {
    return this.consultationFG.controls.medicalServicesId.value!.includes(id);
  }

  isMedicoSelected(): boolean {
    return (this.doctorControl.value as Doctor).id !== "" && (this.doctorControl.value as Doctor).id !== undefined && (this.doctorControl.value as Doctor).id !== null;
  }

  isPatientSelected(): boolean {
    return (this.pacienteControl.value as Paciente).id !== "" && (this.pacienteControl.value as Paciente).id !== undefined && (this.pacienteControl.value as Paciente).id !== null;
  }

  totalAmount(): number {
    return this.consultationFG.controls.medicalServicesId.value!.reduce((acc: number, id: string) => {
      const servicio = this.servicios().find(servicio => servicio.id === id);
      if (servicio) {
        return acc + (Number(servicio.price) ?? 0);
      } else {
        const paquete = this.paquetes().find(paquete => paquete.id === id);
        if (paquete) {
          return acc + (Number(paquete.price) ?? 0);
        }
      }
      return acc;
    }, 0);
  }

  totalTime(): number {
    return this.consultationFG.controls.medicalServicesId.value!.reduce((acc: number, id: string) => {
      const servicio = this.servicios().find(servicio => servicio.id === id);
      if (servicio) {
        return acc + Duration.fromISO(servicio.estimatedDuration!).as('minutes');
      } else {
        const paquete = this.paquetes().find(paquete => paquete.id === id);
        if (paquete) {
          return acc + Duration.fromISO(paquete.estimatedDuration!).as('minutes');
        }
      }
      return acc;
    }, 0);
  }

  totalTimeDisplay(): string {
    return Duration.fromObject({ minutes: this.totalTime() }).toFormat('h.mm');
  }

  canBeCreated(): boolean {
    const startTime = this.turno.controls.startTime.value;
    const endTime = this.turno.controls.endTime.value;
    const availableTime = endTime && startTime ? (endTime.getTime() - startTime.getTime()) / 60000 : 0;
    console.log(this.displayPatient(this.pacienteControl.value as Paciente));
    return this.totalTime() > 0 && this.consultationFG.controls.medicalServicesId.value!.length > 0 && this.consultationFG.controls.patientId.value !== "" && this.consultationFG.controls.shiftId.value !== "" && (this.isSobreTurno || this.totalTime() <= availableTime) && this.isMedicoSelected() && this.isPatientSelected();
  }

}
