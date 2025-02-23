import { CreateTurno, RecurringShift, ShiftBuilder } from './../models/turno.models';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { DayOfWeek } from '../../shared/models/extras.models';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerInputEvent,
  MatDatepickerIntl,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangePicker
} from '@angular/material/datepicker';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipListbox, MatChipListboxChange, MatChipOption, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { TurnosService } from '../services/turnos-service/turnos.service';
import { MatTimepicker, MatTimepickerInput, MatTimepickerModule, MatTimepickerOption } from '@angular/material/timepicker';
import { debounceTime, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { Doctor } from '../../doctors/models/doctor.models';
import { DoctorService } from '../../doctors/service/doctor.service';
import { Especialidad } from '../../especialidad';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Duration } from 'luxon';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-alta-turno',
  imports: [CenteredCardComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatDateRangePicker,
    MatCheckboxModule,
    MatChipListbox,
    MatChipOption,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatLabel,
    MatHint,
    MatDatepickerToggle,
    CommonModule,
    MatChipsModule, MatDivider, MatTimepickerModule,
    MatAutocompleteModule
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  provideMomentDateAdapter(),
  ],
  templateUrl: './alta-turno.component.html',
  styleUrl: './alta-turno.component.scss'
})
export class AltaTurnoComponent implements OnInit {
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));

  readonly dateFormatString = computed(() => {
    if (this._locale() === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  });
  @Input() turnoID: string | null = null;
  today: Date = new Date();
  dateRange = false;
  daysOfWeek = Object.values(DayOfWeek);
  doctorControl = new FormControl<String | Doctor>('');
  public timeRangeInvalid: boolean = false;
  filteredDoctorOptions: Observable<Doctor[]> | undefined;

  public range = new FormGroup({
    date: new FormControl<Date | null>(null, [Validators.required]),
    recurringShift: new FormGroup({
      startDate: new FormControl<Date | null>(null, [Validators.required]),
      endDate: new FormControl<Date | null>(null, [Validators.required]),
      validDays: new FormControl<DayOfWeek[]>([], [Validators.required]),
    }),
    startTime: new FormControl<Date | null>(new Date(), [Validators.required, this.timeRangeValidator]),
    endTime: new FormControl<Date | null>(new Date(new Date().setHours(new Date().getHours() + 1)), [Validators.required, this.timeRangeValidator]),
    place: new FormControl<string>("", Validators.required),
    doctorId: new FormControl<string | null>(null, [Validators.required]),
    timeOfShifts: new FormControl<number | string>(20, [Validators.required, Validators.min(1)]),
    shiftBuilder: new FormControl<ShiftBuilder>(ShiftBuilder.REGULAR, Validators.required),
  }, { validators: Validators.compose([this.timeRangeValidator.bind(this)]) });


  constructor(private turnosService: TurnosService, private doctorService: DoctorService,) { }

  ngOnInit(): void {
    (this.range as FormGroup).removeControl('recurringShift');
    this.filteredDoctorOptions = this.doctorControl.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.doctorService.getDoctorsByName(title).pipe(
          map((doctors: Doctor[]) => {
            return doctors;
          })
        );
      }),
    );
  }

  displayDoctor(doctor: Doctor | null): string {
    return doctor
      ? doctor.gender == "MALE"
        ? `Dr. ${doctor.surname} ${doctor.name}`
        : `Dra. ${doctor.surname} ${doctor.name}`
      : '';
  }

  selectedDoctor(event: MatAutocompleteSelectedEvent) {
    console.log('selected', event.option.value);
    this.doctorControl.setValue(event.option.value);
    this.range.controls.doctorId.patchValue((event.option.value as Doctor).id)
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private timeRangeValidator(control: AbstractControl): { [key: string]: any } | null {
    const group = control as FormGroup;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    console.log("validacion: ", new Date(startTime), new Date(endTime));

    if (startTime && endTime) {
      if (new Date(startTime) >= new Date(endTime)) {
        console.log("invalido");
        group.get('startTime')?.setErrors({ timeRangeInvalid: true });
        group.get('endTime')?.setErrors({ timeRangeInvalid: true });
        return { timeRangeInvalid: true };
      }
    }
    console.log("valido");
    group.get('startTime')?.setErrors(null);
    group.get('endTime')?.setErrors(null);
    return null;
  }

  onDateRangeChange($event: MatCheckboxChange) {
    console.log($event.checked);
    if ($event.checked) {
      if (!this.range.get('recurringShift')) {
        this.range.patchValue({ shiftBuilder: ShiftBuilder.RECURRING });
        this.range.addControl('recurringShift', new FormGroup({
          startDate: new FormControl<Date | null>(null, [Validators.required]),
          endDate: new FormControl<Date | null>(null, [Validators.required]),
          validDays: new FormControl<DayOfWeek[]>([], [Validators.required]),
        }));
      }
    } else {
      this.range.patchValue({ shiftBuilder: ShiftBuilder.REGULAR });
      (this.range as FormGroup).removeControl('recurringShift');
    }
    console.log(this.range.value);
  }

  onStartDateChange($event: MatDatepickerInputEvent<any, any>) {
    this.range.patchValue({ date: $event.value });
    console.log(this.range.value.date!.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    }));
    var date = new Date();
  }

  guardar() {
    console.log(this.range.value);
    console.log((this.range.value as CreateTurno));
    // const timeOfShifts = this.range.value.timeOfShifts as number ?? 0;
    // this.range.patchValue({timeOfShifts: Duration.fromObject({minutes: timeOfShifts}).toISO()});
    console.log(this.range.value.timeOfShifts);
    this.turnosService.createShift(this.range.value as CreateTurno).subscribe((turno) => {
      console.log(turno);
    });
  }

  cancelar() {
    window.history.back()
  }

  validateTimeRange() {
    if (this.range.get("endTime") && this.range.get("startTime")) {
      this.timeRangeInvalid = this.range.get("startTime")?.value! >= this.range.get("endTime")?.value!;
      console.log(this.timeRangeInvalid);
    }
  }

  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    this.range.controls.recurringShift.patchValue({ validDays: Array.from($event.value) });
    console.log(this.range.controls.recurringShift.value.validDays);
  }
}
