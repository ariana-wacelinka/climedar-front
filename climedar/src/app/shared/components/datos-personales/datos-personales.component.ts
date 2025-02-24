import {computed, Component, EventEmitter, Input, OnInit, Output, signal, inject} from '@angular/core';
import { MatSelectModule } from "@angular/material/select";
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, debounceTime, switchMap, filter} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerIntl, MatDatepickerModule} from '@angular/material/datepicker';
import {MatDivider} from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import 'moment/locale/es';

@Component({
  selector: 'app-datos-personales',
  imports: [
      MatSelectModule,
          FormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatAutocompleteModule,
          ReactiveFormsModule,
          MatDatepickerModule,
          MatDivider,
          MatButtonModule,
          MatDatepickerModule
    ],
    providers: [
      {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
      provideMomentDateAdapter(),
    ],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.scss'
})
export class DatosPersonalesComponent implements OnInit {

  @Output() datosPersonales = new EventEmitter<FormGroup>();

  especialidades: {id: string, nombre: string}[] = [];

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));

  readonly dateFormatString = computed(() => {
    if (this._locale() === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  });

  infoPersonal = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required, Validators.min(0)]),
    dni: new FormControl<string>('', [Validators.required, Validators.min(0), Validators.max(99999999), Validators.pattern('^[0-9]*$')]),
    birthdate: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.datosPersonales.emit(this.infoPersonal);
  }

  constructor() { 
    this._locale.set('es');
    this._adapter.setLocale(this._locale());
    this._intl.changes.next();
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    if (!date) return false;
    return date < today;
  }
}
