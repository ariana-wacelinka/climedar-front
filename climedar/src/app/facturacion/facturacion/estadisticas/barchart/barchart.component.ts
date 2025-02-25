import { Component, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Especialidad, EspecialidadService } from '../../../../especialidad';
import { debounceTime, filter, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { PaymentService } from '../../../../shared/services/payment/payment.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-barchart',
  imports: [NgxChartsModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatButtonToggleModule, MatSelectModule, MatAutocompleteModule],
  providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
        provideMomentDateAdapter(),
      ],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss'
})
export class BarchartComponent implements OnInit, OnChanges {
  pieChartRevenueControl = new FormGroup({
    fromDate: new FormControl<Date | null>(
      new Date(new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1)), Validators.required),
    toDate: new FormControl<Date | null>(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), Validators.required),
    revenueType: new FormControl('MONTHLY', Validators.required)
  })

  legendPosition = LegendPosition.Right;
  single = signal<{name: string, value: number}[]>([]);

  view: [number,number] = [900, 500];

  schemeType = ScaleType.Linear;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.pieChartRevenueControl.controls.fromDate.clearValidators();
    this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.clearValidators();
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();

      this.fetchRevenues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
  }

  onSelect(event: Event) {
    console.log(event);
    console.log(this.pieChartRevenueControl.value)
  }

  onSelectRevenueType(event: string) {
    console.log(this.pieChartRevenueControl.value.revenueType);
    this.pieChartRevenueControl.controls.revenueType.setValue(event);
    if (event === 'DAILY') {
      console.log('entra a DAILY')
      this.pieChartRevenueControl.controls.fromDate.clearValidators();
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.clearValidators();
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    if (event === 'MONTHLY') {
      console.log('entra a MONTHLY')
      const now = new Date();
      this.pieChartRevenueControl.controls.fromDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    if (event === 'RANGE') {
      console.log('entra a RANGE')
      const now = new Date();
      this.pieChartRevenueControl.controls.fromDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    this.pieChartRevenueControl.updateValueAndValidity();
  }

    fetchRevenues() {
      // this.pieChartRevenueControl.updateValueAndValidity();
      if (this.pieChartRevenueControl.invalid) {
        this.pieChartRevenueControl.markAllAsTouched();
        this.pieChartRevenueControl.markAsDirty();
        console.log('invalid', this.pieChartRevenueControl.errors);
        console.log('invalid', this.pieChartRevenueControl.invalid);
        return;
      }
      this.paymentService.getDatesRevenues(
        this.pieChartRevenueControl.value.fromDate?.toISOString().split('T')[0],
        this.pieChartRevenueControl.value.toDate?.toISOString().split('T')[0],
        this.pieChartRevenueControl.value.revenueType!
      ).subscribe(
        (response) => {
          console.log('response', response);
          this.single.set(response.map((revenue) => {
            return {name: revenue.date, value: revenue.value}
          }))
        }
      );
    }

    onSelectedDate(event: Moment, dp: MatDatepicker<Date>, control: number) {
      console.log(event);
      console.log(dp);
      console.log(control);
      let date = new Date();
      date.setFullYear(event.year());
      date.setMonth(control === 1 ? event.month() : event.month() + 1);
      date.setDate(control === 1 ? 1 : 0);
      console.log(date);
      if (control === 1) {
        this.pieChartRevenueControl.controls.fromDate.setValue(date);
      }
      if (control === 2) {
        this.pieChartRevenueControl.controls.toDate.setValue(date);
      }
      dp.close();
      this.fetchRevenues();
    }

    selectDate() {
      console.log('selectDate');
      console.log(this.pieChartRevenueControl.value);
      this.fetchRevenues();
    }
}