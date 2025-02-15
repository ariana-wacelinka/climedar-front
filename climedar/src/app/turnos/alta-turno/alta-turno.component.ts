import { Component, Input } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule, MatHint, MatLabel} from '@angular/material/form-field';
import { DayOfWeek } from '../../shared/models/extras.models';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangePicker
} from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipListbox, MatChipListboxChange, MatChipOption, MatChipsModule} from "@angular/material/chips";
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatDivider} from '@angular/material/divider';

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
    MatChipsModule, MatDivider,
  ],
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},],
  templateUrl: './alta-turno.component.html',
  styleUrl: './alta-turno.component.scss'
})
export class AltaTurnoComponent {

  @Input() turnoID: string | null = null;
  today: Date = new Date();
  dateRange = false;
  daysOfWeek = Object.values(DayOfWeek);

  public timeRangeInvalid: boolean = false;

  readonly range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
    daysOfWeek: new FormControl<DayOfWeek[] | []>([]),
    startTime: new FormControl<string | null>(this.formatTime(new Date()), [Validators.required]),
    endTime: new FormControl<string | null>(this.formatTime(new Date(new Date().setHours(new Date().getHours() + 1))), [Validators.required]),
    multiple: new FormControl<boolean | null>(false),
  }, {validators: Validators.compose([this.timeRangeValidator.bind(this)])});

  readonly rangePicker: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  }, {validators: Validators.compose([this.timeRangeValidator.bind(this)])});

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private timeRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const group = control as FormGroup;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startTime && endTime && startTime > endTime) {
      group.get('startTime')?.setErrors({timeRangeInvalid: true});
      group.get('endTime')?.setErrors({timeRangeInvalid: true});
      return {timeRangeInvalid: true};
    } else {
      group.get('startTime')?.setErrors(null);
      group.get('endTime')?.setErrors(null);
    }
    return null;
  }

  dateChangeEvent(change: string, $event: MatDatepickerInputEvent<any, any>) {
    this.range.patchValue({start: $event.value, end: $event.value});
    console.log(this.range.value.start.toISOString());
    console.log(this.range.value.end.toISOString());
    console.log(this.range.value.start.toLocaleString('es-ES', {
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
  }

  cancelar() {
    window.history.back()
  }

  validateTimeRange() {
    if (this.range.get("endTime") && this.range.get("startTime")) {
      this.timeRangeInvalid = this.range.get("startTime")?.value >= this.range.get("endTime")?.value;
      console.log(this.timeRangeInvalid);
    }
  }

  chipsChangeEvent(arg0: string, $event: MatChipListboxChange) {
    this.range.patchValue({daysOfWeek: Array.from($event.value)});
    console.log(this.range.value.daysOfWeek);
  }
}
