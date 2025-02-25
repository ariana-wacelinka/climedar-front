import { TurnosService } from './../../turnos/services/turnos-service/turnos.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { MatListModule } from '@angular/material/list';
import { MedicalService } from '../../servicio/models/services.models';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Doctor } from '../../doctors/models/doctor.models';
import { Observable, startWith, filter, debounceTime, switchMap, map, timestamp } from 'rxjs';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Paciente } from '../../patients/models/paciente.models';
import { ServiciosMedicosService } from '../../servicio/services/servicio/servicios-medicos.service';
import { PageInfo } from '../../shared/models/extras.models';
import { Duration } from 'luxon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PatientService } from '../../patients/services/patient.service';
import { Consultation, CreateConsultation } from '../models/consultation.model';
import { ConsultationService } from '../services/consultation.service';
import { PackageResponse } from '../../paquetes/models/package.models';
import { PaymentDialogComponent } from '../../shared/components/payment-dialog/payment-dialog.component';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
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
  snackbar = inject(MatSnackBar);
  isSobreTurno = false;
  pago = false;
  consultationPrice = signal<number>(0);
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  consultationFG = new FormGroup({
    patientId: new FormControl<string>("", [Validators.required]),
    shiftId: new FormControl<string>("", [Validators.required]),
    doctorId: new FormControl<string>(""),
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
  filteredPatientOptions: Observable<Paciente[]> | undefined;
  filteredDoctorOptions: Observable<Doctor[]> | undefined;
  servicioControl = new FormControl<string>("");
  paqueteControl = new FormControl<string>("");
  consultation = signal<boolean>(false);

  constructor(private paymentService: PaymentService, private medicalService: ServiciosMedicosService, private route: ActivatedRoute, private router: Router, private turnosService: TurnosService, private doctorService: DoctorService, private pacienteService: PatientService, private consultationService: ConsultationService, private dialog: MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    const id = navigation?.extras?.state?.['turnoId'] || null;
    console.log('turnoId', id);
    var consultation = navigation?.extras?.state?.['consultaData'] || null;
    console.log('consultaData', consultation);
    var turno = navigation?.extras?.state?.['turno'] || null;
    if (id !== null) {
      this.turnoId.set(id);
      this.consultationFG.controls.shiftId.setValue(id);
    } else {
      if (consultation) {
        this.consultation.set(true);
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
  }


  changeSobreTurno() {
    if (this.isSobreTurno) {
      this.consultationFG.controls.shiftId.setValue("");
      this.consultationFG.controls.shiftId.removeValidators([Validators.required]);
      this.consultationFG.controls.doctorId.setValidators([Validators.required]);
      if ((this.doctorControl.value as Doctor).id) {
        this.consultationFG.controls.doctorId.setValue((this.doctorControl.value as Doctor).id);
      }
      this.consultationFG.controls.doctorId.updateValueAndValidity();
      this.consultationFG.controls.shiftId.updateValueAndValidity();
    } else {
      this.consultationFG.controls.shiftId.setValidators([Validators.required]);
      this.consultationFG.controls.doctorId.setValue("");
      this.consultationFG.controls.doctorId.removeValidators([Validators.required]);
      this.consultationFG.controls.doctorId.updateValueAndValidity();
      this.consultationFG.controls.shiftId.updateValueAndValidity();
    }
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
        return this.pacienteService.getPacientes(1, title).pipe(
          map(response => {
            return response.patients;
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
        this.getServices(title, (this.doctorControl.value as Doctor).speciality?.id)
        return [];
      }),
    ).subscribe();

    this.paqueteControl.valueChanges.pipe(
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
        this.getPackages(title, (this.doctorControl.value as Doctor).speciality?.id);
        return [];
      }),
    ).subscribe();
  }

  isFromShift(): boolean {
    return !!this.turnoId();
  }

  serviciosDelPaquete(paquete: PackageResponse): string {
    return paquete.services!.map(service => service.name).join(', ');
  }

  createConsultation(): void {
    this.consultationFG.controls.medicalServicesId.updateValueAndValidity();
    console.log('consultationFG', this.consultationFG.value);
    if (this.consultationFG.valid) {
      if (this.pago) {
        console.log('pago');
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          data: { price: this.consultationPrice() }
        });

        dialogRef.componentInstance.paymentConfirmed.subscribe((method: string) => {
          console.log('method', method);

          console.log('consultationFG', (this.consultationFG.value as CreateConsultation));
          this.consultationService.createConsultation(this.consultationFG.value as CreateConsultation).subscribe(
            (data: Consultation) => {
              this.snackbar.open('Consulta creada con éxito', 'Cerrar', { duration: 1000 });
              console.log('data', data);
              if (data) {
                console.log("se manda el pago: ", method);
                this.paymentService.createPayment(method, data.id!).subscribe(
                  (blob) => {
                    console.log('blob', blob);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const nombrePaciente = (this.pacienteControl.value as Paciente).name + "-" + (this.pacienteControl.value as Paciente).surname;
                    a.download = `factura-${data.id}-${nombrePaciente}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    setTimeout(() => {
                      this.router.navigate(['/home']);
                    }, 1050);
                  },
                  (error) => {
                    console.log('error', error);
                    this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al realizar el pago' } });
                  }
                );
              }
            },
            (error) => {
              this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear la consulta' } });
              console.log('error', error);
            }
          );
        });
      } else {
        console.log('no pago');
        this.consultationService.createConsultation(this.consultationFG.value as CreateConsultation).subscribe(
          (data) => {
            console.log('data', data);
            this.snackbar.open('Consulta creada con éxito', 'Cerrar', { duration: 1000 });
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1050);
          },
          (error) => {
            console.log('error', error);
            this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear la consulta' } });
          });
      }
    } else {
      console.log('invalid');
      console.log('consultationFG', this.consultationFG.value);
      //errores:
      if (this.consultationFG.controls.medicalServicesId.errors) {
        console.log('servicios requeridos');
      }
      if (this.consultationFG.controls.patientId.errors) {
        console.log('paciente requerido');
      }
      if (this.consultationFG.controls.shiftId.errors) {
        console.log('turno requerido');
      }
    }
  }

  getServices(name: string = this.servicioControl.value!, specialityId: string = ""): void {
    this.medicalService.getServiciosMedicos(name, specialityId).subscribe((data) => {
      console.log('doctorControl', (this.doctorControl.value as Doctor));
      if ((this.doctorControl.value as Doctor).id) {
        this.servicios.set(data.services);
        this.pageInfo.set(data.pageInfo);
      }
    });
  }

  getPackages(name: string = this.paqueteControl.value!, specialityId: string = ""): void {
    this.medicalService.getPaquetesMedicos(name, specialityId).subscribe((data) => {
      console.log('doctorControl', (this.doctorControl.value as Doctor));
      if ((this.doctorControl.value as Doctor).id) {
        this.paquetes.set(data.packages);
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
    this.getPackages("", (event.option.value as Doctor).speciality!.id);
    this.consultationFG.controls.doctorId.setValue((event.option.value as Doctor).id);
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
    this.totalAmount();
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
    this.totalAmount();
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

  totalAmount() {
    console.log("totalAmount");
    this.consultationService.getConsultationPrice(this.consultationFG.controls.medicalServicesId.value!, this.consultationFG.controls.patientId.value!).subscribe((data: number) => {
      console.log('data', data);
      this.consultationPrice.set(data || 0);
    });
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
    return this.totalTime() > 0 && this.consultationFG.controls.medicalServicesId.value!.length > 0 && this.consultationFG.controls.patientId.value !== "" && ((this.consultationFG.get("shiftId") != null && this.consultationFG.controls.shiftId.value !== "") || (this.consultationFG.get("doctorId") != null && this.consultationFG.get("doctorId")!.value != "")) && (this.isSobreTurno || this.totalTime() <= availableTime) && this.isMedicoSelected() && this.isPatientSelected();
  }

  cancelar() {
    if (this.consultationFG.dirty) {
      this.dialog.open(ConfirmationDialogComponent, { data: { message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.' } }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }
}
