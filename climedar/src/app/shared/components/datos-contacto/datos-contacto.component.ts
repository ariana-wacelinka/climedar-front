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


@Component({
  selector: 'app-datos-contacto',
  imports: [
    MatSelectModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatDivider,
        MatButtonModule
  ],
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent implements OnInit {

  @Output() datosContacto = new EventEmitter<any>();

  especialidades: {id: string, nombre: string}[] = []

  infoLaboral = new FormGroup({
    especialidad: new FormControl('', [Validators.required]),
    sueldo: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  ngOnInit(): void {
    this.datosContacto.emit(this.infoLaboral);
  }

}
