import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosObraSocialComponent } from './datos-obra-social/datos-obra-social.component';
import { Paciente } from '../models/paciente.models';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';

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

  constructor(private patientService: PatientService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.pacienteId.set(navigation?.extras.state?.['id']);
  }

  ngOnInit() {
    if (this.pacienteId() !== '') {
      const id = new FormControl(this.pacienteId(), [Validators.required]);
      this.patientForm.addControl('id', id);
      this.patientService.getPatientById(this.pacienteId()).subscribe(
        (response) => {
          console.log('Paciente obtenido', response);
          this.patientForm.patchValue(response);
        },
        (error) => {
          console.error('Error al obtener paciente', error);
        }
      );
    }
  }

  public guardar() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.patientForm.markAsDirty();
      return;
    }

    if (this.pacienteId() === '') {
      console.log('Guardando paciente:' + (this.patientForm.value as Paciente).name);
      this.patientService.createPatient(this.patientForm.value as Paciente).subscribe(
        (response) => {
          console.log('Paciente creado', response);
        },
        (error) => {
          console.error('Error al crear paciente', error);
        }
      );
    } else {
      console.log('Actualizando paciente:' + this.patientForm.value.id);
      this.patientService.updatePatient(this.patientForm.value as Paciente).subscribe(
        (response) => {
          console.log('Paciente actualizado', response);
        },
        (error) => {
          console.error('Error al actualizar paciente', error);
        }
      );
    }
  }

  public cancelar() {
    window.history.back();
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
