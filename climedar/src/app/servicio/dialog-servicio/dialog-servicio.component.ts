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
import {MatFormField, MatHint, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';

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
    MatHint,
    ReactiveFormsModule,
    MatPrefix,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.scss'
})
export class DialogServicioComponent {

  formGroup = new FormGroup({
    nombre: new FormControl ('', Validators.required),
    descripcion: new FormControl ('', Validators.required),
    precio: new FormControl ('', Validators.required),
    duracionEstimada: new FormControl ('', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$\n')])
  });

  formGroup2 = new FormGroup({
    nombreEditar: new FormControl ('', Validators.required),
    descripcionEditar: new FormControl ('', [Validators.required, Validators.maxLength(150)]),
    precioEditar: new FormControl ('', Validators.required),
    duracionEstimadaEditar: new FormControl ('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number, nombre?: string, descripcion?: string, precio?: number, duracionEstimada?: number }
  ) {
    if (data.nombre != null && data.descripcion != null && data.precio != null && data.duracionEstimada != null){
      this.formGroup2.setValue({ nombreEditar: data.nombre, descripcionEditar: data.descripcion, precioEditar: data.precio.toString(), duracionEstimadaEditar: data.duracionEstimada.toString() });
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
