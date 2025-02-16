import { computed, Component, EventEmitter, Input, OnInit, Output, signal, inject } from '@angular/core';
import { MatSelectModule } from "@angular/material/select";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, switchMap, filter } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Especialidad, EspecialidadService } from '../../../especialidad';
import { DialogEspecialidadComponent } from '../../../especialidad/dialog-especialidad/dialog-especialidad.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-datos-profesionales',
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
    AsyncPipe
  ],
  templateUrl: './datos-profesionales.component.html',
  styleUrl: './datos-profesionales.component.scss'
})
export class DatosProfesionalesComponent implements OnInit {

  @Output() datosProfesionales = new EventEmitter<any>();

  filteredEspecialidadOptions: Observable<Especialidad[]> | undefined;

  infoLaboral = new FormGroup({
    speciality: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  public nueva_especialidad() {
    this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  constructor(private especialidadService: EspecialidadService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.datosProfesionales.emit(this.infoLaboral);

    this.filteredEspecialidadOptions = this.infoLaboral.controls.speciality.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.especialidadService.getEspecialidadesByNombre(title).pipe(
          map((especiliades: Especialidad[]) => {
            return especiliades;
          })
        );
      }),
    );
  }

  displayEspecialidad(especialidad: Especialidad | undefined): string {
    return especialidad ? especialidad.name! : '';
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
    //filtrado de medicos por especialidad y busqueda de turnos
    this.infoLaboral.controls.speciality.setValue(event.option.value);
  }

}
