import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, DoCheck, signal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosProfesionalesComponent } from './datos-profesionales/datos-profesionales.component';
import { DoctorService } from '../service/doctor.service';
import { Doctor } from '../models/doctor.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-doctor',
  imports: [
    CenteredCardComponent,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DatosPersonalesComponent,
    DatosContactoComponent,
    DatosDireccionComponent,
    DatosProfesionalesComponent
  ],
  templateUrl: './alta-doctor.component.html',
  styleUrl: './alta-doctor.component.scss'
})
export class AltaDoctorComponent {
  public doctorId = signal<string>('');
  public doctorForm = new FormGroup({});

  constructor(private doctorService: DoctorService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.doctorId.set(navigation?.extras.state?.['id']);
  }

  ngOnInit() {
    if (this.doctorId() !== '') {
      this.doctorService.getDoctorById(this.doctorId()).subscribe(
        (response) => {
          console.log('Doctor obtenido', response);
          this.doctorForm.patchValue(response);
          this.doctorForm.patchValue({ id: response.id });
        },
        (error) => {
          console.error('Error al obtener doctor', error);
        }
      );
    }
  }

  public guardar() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      this.doctorForm.markAsDirty();
      return;
    }

    if (this.doctorId() !== '') {
      this.doctorService.updateDoctor((this.doctorForm.value as Doctor)).subscribe(
        (response) => {
          console.log('Doctor actualizado', response);
        },
        (error) => {
          console.error('Error al actualizar doctor', error);
        }
      );
    } else {
      console.log('doctor:' + JSON.stringify(this.doctorForm.value as Doctor).replace(/"([^"]+)":/g, '$1:'));
      this.doctorService.createDoctor(this.doctorForm.value).subscribe(
        (response) => {
          console.log('Doctor creado', response);
        },
        (error) => {
          console.error('Error al crear doctor', error);
        }
      );
      console.log(this.doctorForm.value);
    }

  }

  public cancelar() {
    window.history.back();
  }

  onFormChanges(form: FormGroup) {
    if (Object.keys(form.controls).includes('street')) {
      this.doctorForm.addControl('address', form);
    } else {
      Object.keys(form.controls).forEach(key => {
        this.doctorForm.addControl(key, form.controls[key]);
      });
    }
    console.log('onFormChanges ', this.doctorForm.value);
  }
}
