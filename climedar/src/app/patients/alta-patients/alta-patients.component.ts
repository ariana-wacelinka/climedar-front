import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosObraSocialComponent } from './datos-obra-social/datos-obra-social.component';
import { Paciente } from '../models/paciente.models';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alta-patients',
  imports: [
    CenteredCardComponent,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DatosPersonalesComponent,
    DatosContactoComponent,
    DatosDireccionComponent,
    DatosObraSocialComponent
  ],
  templateUrl: './alta-patients.component.html',
  styleUrl: './alta-patients.component.scss'
})
export class AltaPatientsComponent {
  public patientForm: FormGroup = new FormGroup({});
  public pacienteId = signal<string>('');
  snackbar = inject(MatSnackBar);

  constructor(private patientService: PatientService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.pacienteId.set(navigation?.extras.state?.['id']);
  }

  ngOnInit() {
    if (this.isNumber(this.pacienteId())) {
      const id = new FormControl(this.pacienteId(), [Validators.required]);
      this.patientForm.addControl('id', id);
      this.patientService.getPatientById(this.pacienteId()).subscribe(
        (response) => {
          console.log('Paciente obtenido', response);
          const birthdate = new Date(response.birthdate!);
          const formattedBirthdate = birthdate.toISOString().split('T')[0];
          this.patientForm.patchValue({ ...response, birthdate: formattedBirthdate });
        },
        (error) => {
          console.error('Error al obtener paciente', error);
        }
      );
    }
  }

  public isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  public guardar() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.patientForm.markAsDirty();
      return;
    }

    if (this.isNumber(this.pacienteId())) {
      console.log('Actualizando paciente:' + this.patientForm.value.id);
      this.patientService.updatePatient(this.patientForm.value as Paciente).subscribe(
        (response) => {
          console.log('Paciente actualizado', response);
          this.snackbar.open('Paciente actualizado exitosamente', 'Cerrar', { duration: 1000 });
          setTimeout(() => {
            this.router.navigate(['/paciente/listado']);
          }, 1050);
        },
        (error) => {
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al actualizar paciente' } });
          console.error('Error al actualizar paciente', error);
        }
      );
    } else {
      console.log('Guardando paciente:' + (this.patientForm.value as Paciente).name);
      this.patientService.createPatient(this.patientForm.value as Paciente).subscribe(
        (response) => {
          this.snackbar.open('Paciente creado exitosamente', 'Cerrar', { duration: 1000 });
          console.log('Paciente creado', response);
          setTimeout(() => {
            this.router.navigate(['/paciente/listado']);
          }, 1050);
        },
        (error) => {
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear paciente' } });
          console.error('Error al crear paciente', error);
        }
      );

    }
  }

  public cancelar() {
    if (this.patientForm.dirty) {
      this.dialog.open(ConfirmationDialogComponent, { data: { message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.' } }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }

  onFormChanges(form: FormGroup) {
    if (Object.keys(form.controls).includes('street')) {
      this.patientForm.addControl('address', form);
    } else {
      Object.keys(form.controls).forEach(key => {
        this.patientForm.addControl(key, form.controls[key]);
      });
    }
    console.log('onFormChanges ', this.patientForm.value);
  }
}
