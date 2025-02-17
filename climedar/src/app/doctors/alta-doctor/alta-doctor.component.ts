import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosProfesionalesComponent } from './datos-profesionales/datos-profesionales.component';
import { DoctorService } from '../service/doctor.service';
import { Doctor } from '../models/doctor.models';

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

  public doctorForm = new FormGroup({});

  constructor(private doctorService: DoctorService) {}
  
  public guardar(){
    if(this.doctorForm.invalid){
      this.doctorForm.markAllAsTouched();
      this.doctorForm.markAsDirty();
      return;
    }
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

  public cancelar(){
    return;
  }

  onFormChanges(form: FormGroup){
    if (Object.keys(form.controls).includes('street')){
      this.doctorForm.addControl('address', form);
    } else {
      Object.keys(form.controls).forEach(key => {
        this.doctorForm.addControl(key, form.controls[key]);
      });
    }
    console.log('onFormChanges ', this.doctorForm.value);
  }
}
