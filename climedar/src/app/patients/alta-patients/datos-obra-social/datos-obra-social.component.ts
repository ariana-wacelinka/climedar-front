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
  selector: 'app-datos-obra-social',
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
  templateUrl: './datos-obra-social.component.html',
  styleUrl: './datos-obra-social.component.scss'
})
export class DatosObraSocialComponent {

  @Output() datosObraSocial = new EventEmitter<any>();
  
    obrasSociales: {id: string, nombre: string}[] = [
      {id: '1', nombre: 'osde'},
      {id: '2', nombre: 'swiss medical'},
      {id: '3', nombre: 'galeno'},
    ]
  
    infoObraSocial = new FormGroup({
      obraSocial: new FormControl('', [Validators.required]),
    })
  
    public nueva_obra_social(){
      return;
    }
  
    ngOnInit(){
      this.datosObraSocial.emit(this.infoObraSocial);
    }

}
