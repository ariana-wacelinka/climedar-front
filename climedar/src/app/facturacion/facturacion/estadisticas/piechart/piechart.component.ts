import { Component, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { Especialidad, EspecialidadService } from '../../../../especialidad';
import { debounceTime, filter, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { PaymentService } from '../../../../shared/services/payment/payment.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-piechart',
  imports: [NgxChartsModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatButtonToggleModule, MatSelectModule, MatAutocompleteModule, AsyncPipe],
  providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
        provideMomentDateAdapter(),
      ],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})
export class PiechartComponent implements OnInit, OnChanges {
  pieChartRevenueControl = new FormGroup({
    date: new FormControl<Date | null>(new Date(), Validators.required),
    fromDate: new FormControl<Date | null>(null, Validators.required),
    toDate: new FormControl<Date | null>(null, Validators.required),
    revenueType: new FormControl('DAILY',   Validators.required),
    specialityName: new FormControl('', Validators.required),
    serviceType: new FormControl('', Validators.required),
    originName: new FormControl('SPECIALITY', Validators.required),
  })

  especialidades: Especialidad[] = [];
  filteredEspecialidadOptions:  Observable<Especialidad[]> | undefined;
  especialidadControl = new FormControl<String | Especialidad>('');

  legendPosition = LegendPosition.Right;
  single = signal<{name: string, value: number}[]>([]);

  view: [number,number] = [900, 650];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private especialidadService: EspecialidadService, private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.pieChartRevenueControl.controls.fromDate.clearValidators();
    this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.clearValidators();
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.serviceType.clearValidators();
      this.pieChartRevenueControl.controls.serviceType.updateValueAndValidity();
      this.filteredEspecialidadOptions = this.especialidadControl.valueChanges.pipe(
        startWith(''), 
        filter((value): value is string => typeof value === 'string'),
        debounceTime(300),
        switchMap(value => 
          this.especialidadService.getEspecialidadesByNombre(value).pipe(
            tap((especialidades: Especialidad[]) => {
              // Si es la primera vez y hay resultados, establece el valor por defecto
              if (!this.especialidadControl.value && especialidades.length > 0) {
                this.especialidadControl.setValue(especialidades[0]);
                this.pieChartRevenueControl.patchValue({specialityName: especialidades[0].name});
                this.fetchRevenues();
              }
            }),
            map((especialidades: Especialidad[]) => especialidades)
          )
        )
      );

      
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onSelect(event: Event) {
  }

  onSelectRevenueType(event: string) {
    this.pieChartRevenueControl.patchValue({revenueType: event});
    if (event === 'DAILY') {
      this.pieChartRevenueControl.patchValue({date: new Date(), fromDate: null, toDate: null});
      this.pieChartRevenueControl.controls.date.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.date.updateValueAndValidity();
      this.pieChartRevenueControl.controls.fromDate.clearValidators();
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.clearValidators();
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    if (event === 'MONTHLY') {
      const now = new Date();
      this.pieChartRevenueControl.patchValue({date: null, fromDate: new Date(now.getFullYear() - 1, now.getMonth(), 1), toDate: new Date(now.getFullYear(), now.getMonth(), 1)});
      this.pieChartRevenueControl.controls.date.clearValidators();
      this.pieChartRevenueControl.controls.date.updateValueAndValidity();
      this.pieChartRevenueControl.controls.fromDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    if (event === 'RANGE') {
      const now = new Date();
      this.pieChartRevenueControl.patchValue({date: null, fromDate: new Date(now.getFullYear(), now.getMonth(), 1), toDate: new Date(now.getFullYear(), now.getMonth(), 7)});
      this.pieChartRevenueControl.controls.date.clearValidators();
      this.pieChartRevenueControl.controls.date.updateValueAndValidity();
      this.pieChartRevenueControl.controls.fromDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.fromDate.updateValueAndValidity();
      this.pieChartRevenueControl.controls.toDate.setValidators(Validators.required);
      this.pieChartRevenueControl.controls.toDate.updateValueAndValidity();
    }
    this.pieChartRevenueControl.updateValueAndValidity();
    this.fetchRevenues();
  }

  onSelectServiceType(event: string) {
    this.pieChartRevenueControl.patchValue({serviceType: event});
    this.fetchRevenues();
  }

  displayEspecialidad(especialidad: Especialidad | null): string {
    return especialidad ? especialidad.name! : '';
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
      //filtrado de medicos por especialidad y busqueda de turnos
      this.especialidadControl.setValue((event.option.value));
      this.pieChartRevenueControl.patchValue({specialityName: (event.option.value as Especialidad).name
      });
      this.fetchRevenues();
    }

    changeOrigin(event: MatButtonToggleChange) {
      this.pieChartRevenueControl.patchValue({originName: event.value});
      if (event.value === 'SPECIALITY') {
        this.especialidadControl.setValue(this.especialidades[0]);
        this.pieChartRevenueControl.patchValue({specialityName: '', serviceType: ''});
        this.pieChartRevenueControl.controls.specialityName.setValidators(Validators.required);
        this.pieChartRevenueControl.controls.specialityName.updateValueAndValidity();
        this.pieChartRevenueControl.controls.serviceType.clearValidators();
        this.pieChartRevenueControl.controls.serviceType.updateValueAndValidity();
      }
      if (event.value === 'MEDICAL_SERVICE') {
        this.pieChartRevenueControl.patchValue({specialityName: '', serviceType: 'GENERAL'});
        this.pieChartRevenueControl.controls.specialityName.clearValidators();
        this.pieChartRevenueControl.controls.specialityName.updateValueAndValidity();
        this.pieChartRevenueControl.controls.serviceType.setValidators(Validators.required);
        this.pieChartRevenueControl.controls.serviceType.updateValueAndValidity();
      }
      this.fetchRevenues();
    }

    fetchRevenues() {
      // this.pieChartRevenueControl.updateValueAndValidity();
      if (this.pieChartRevenueControl.invalid) {
        this.pieChartRevenueControl.markAllAsTouched();
        this.pieChartRevenueControl.markAsDirty();
        return;
      }
      this.paymentService.getRevenues(
        this.pieChartRevenueControl.value.fromDate?.toISOString().split('T')[0],
        this.pieChartRevenueControl.value.toDate?.toISOString().split('T')[0],
        this.pieChartRevenueControl.value.revenueType!,
        this.pieChartRevenueControl.value.originName!,
        this.pieChartRevenueControl.value.date?.toISOString().split('T')[0],
        this.pieChartRevenueControl.value.serviceType!,
        this.pieChartRevenueControl.value.specialityName!
      ).subscribe(
        (response) => {
          this.single.set(response.map((revenue) => {
            return {name: revenue.name, value: revenue.value}
          }))
        }
      );
    }

    onSelectedDate() {
      this.fetchRevenues();
    }

    onSelectedMonth(event: Moment, dp: MatDatepicker<Date>, control: number) {
          let date = new Date();
          date.setFullYear(event.year());
          date.setMonth(control === 1 ? event.month() : event.month() + 1);
          date.setDate(control === 1 ? 1 : 0);
          if (control === 1) {
            this.pieChartRevenueControl.controls.fromDate.setValue(date);
          }
          if (control === 2) {
            this.pieChartRevenueControl.controls.toDate.setValue(date);
          }
          dp.close();
          this.fetchRevenues();
        }
}
