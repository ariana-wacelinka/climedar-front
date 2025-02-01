import {Component, Inject, Input, input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-dialog-obrasocial',
  imports: [
    MatDialogTitle,
    MatLabel,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInput
  ],
  templateUrl: './dialog-obrasocial.component.html',
  styleUrl: './dialog-obrasocial.component.scss'
})
export class DialogObrasocialComponent {

  formGroup = new FormGroup({
    nombre: new FormControl ('', Validators.required)
  });

  formGroup2 = new FormGroup({
    nombreEditar: new FormControl ('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogObrasocialComponent>,
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
        this.onClose();
      }
    } else {
      if (this.formGroup2.valid){
        alert('Obra social editada: ' + this.formGroup2.value.nombreEditar);
        this.onClose();
      }
    }
  }
}
