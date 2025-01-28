import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosProfesionalesComponent } from './datos-profesionales/datos-profesionales.component';

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
  
  public guardar(){
    console.log(this.doctorForm.value);
  }

  public cancelar(){
    return;
  }

  onFormChanges(form: FormGroup){
    Object.keys(form.controls).forEach(key => {
      this.doctorForm.addControl(key, form.controls[key]);
    });
  }
}
