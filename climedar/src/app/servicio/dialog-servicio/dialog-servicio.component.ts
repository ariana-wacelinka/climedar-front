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
    id: new FormControl (''),
    nombre: new FormControl ('', Validators.required),
    descripcion: new FormControl ('', Validators.required),
    precio: new FormControl ('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    duracionEstimada: new FormControl ('', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$\n')])
  });

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, nombre?: string, descripcion?: string, precio?: number, duracionEstimada?: string }
  ) {
    if (data) {
      console.log(data);
      this.formGroup.patchValue({
        id: data.id ?? '',
        nombre: data.nombre ?? '',
        descripcion: data.descripcion ?? '',
        precio: data.precio?.toString() ?? '',
        duracionEstimada: data.duracionEstimada ?? ''
      });
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
      if (this.formGroup.valid){
        alert('Servicio editado: ' + this.formGroup.value.nombre) ;
        this.onClose();
      }
    }
  }
}
