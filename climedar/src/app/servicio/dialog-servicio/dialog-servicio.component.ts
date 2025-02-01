import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-dialog-servicio',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatPrefix,
    MatSuffix
  ],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.scss'
})
export class DialogServicioComponent {

  formGroup = new FormGroup({
    nombre: new FormControl ('', Validators.required)
  });

  formGroup2 = new FormGroup({
    nombreEditar: new FormControl ('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number, nombre?: string }
  ) {
    if (data.nombre != null) {
      this.formGroup2.setValue({ nombreEditar: data.nombre });
    } else {
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data.id == null){
      if (this.formGroup.valid){
        alert('Servicio creado: ' + this.formGroup.value.nombre);
        this.onClose();
      }
    } else {
      if (this.formGroup2.valid){
        alert('Servicio editado: ' + this.formGroup2.value.nombreEditar);
        this.onClose();
      }
    }
  }

}
