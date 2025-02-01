import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-dialog-especialidad',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
  templateUrl: './dialog-especialidad.component.html',
  styleUrl: './dialog-especialidad.component.scss'
})
export class DialogEspecialidadComponent {

  formGroup = new FormGroup({
    nombre: new FormControl ('', Validators.required)
  });

  formGroup2 = new FormGroup({
    nombreEditar: new FormControl ('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogEspecialidadComponent>,
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
        alert('Obra social creada: ' + this.formGroup.value.nombre);
      } else {
      }
    } else {
      if (this.formGroup2.valid){
        alert('Obra social editada: ' + this.formGroup2.value.nombreEditar);
      } else {
      }
    }
  }
}
