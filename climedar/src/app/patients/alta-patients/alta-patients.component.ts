import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosObraSocialComponent } from './datos-obra-social/datos-obra-social.component';

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

  public patientForm = new FormGroup({});
    
    public guardar(){
      if(this.patientForm.invalid){
        this.patientForm.markAllAsTouched();
        return;
      }
      console.log(this.patientForm.value);
    }
  
    public cancelar(){
      return;
    }
  
    onFormChanges(form: FormGroup){
      Object.keys(form.controls).forEach(key => {
        this.patientForm.addControl(key, form.controls[key]);
      });
    }
}
