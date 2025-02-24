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
import { MedcialSecure } from '../../../obra-social/models/medicalSecure.model';
import { ObraSocialService } from '../../../obra-social/service/obra-social.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogObrasocialComponent } from '../../../obra-social/dialog-obrasocial/dialog-obrasocial.component';

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
export class DatosObraSocialComponent implements OnInit {

  @Output() datosObraSocial = new EventEmitter<FormGroup>();

  obrasSociales: MedcialSecure[] = []

  infoObraSocial = new FormGroup({
    medicalSecure: new FormGroup({
      id: new FormControl('', [Validators.required])
    }),
  })

  public nueva_obra_social() {
    this.dialog.open(DialogObrasocialComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  constructor(private obraSocialService: ObraSocialService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.datosObraSocial.emit(this.infoObraSocial);

    this.obraSocialService.getMedicalSecures().subscribe(
      (response) => {
        console.log('Obras sociales', response);
        this.obrasSociales = response;
      }
    );
  }

}
