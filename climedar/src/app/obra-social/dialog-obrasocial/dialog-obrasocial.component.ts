import { Component, Inject, Input, input, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ObraSocialService } from '../services/obra-social.service';
import { ObraSocial } from '../models/obra-social.models';

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
  obraSocial = signal<ObraSocial>({});
  formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogObrasocialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, name?: string },
    public obraSocialService: ObraSocialService
  ) {
    if (data.id && data.name) {
      this.obraSocial.set(data);
      this.formGroup.setValue({
        id: data.id,
        name: data.name
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data.id == null) {
      if (this.formGroup.valid) {
        const obraSocialSent: ObraSocial = {
          id: "",
          name: this.obraSocial().name
        };

        this.obraSocialService.createObraSocial(obraSocialSent).subscribe(
          (obraSocial) => {
            alert('Obra social creada: ' + obraSocial.name);
            this.onClose();
            window.location.reload();
          });
      }
    } else {
      if (this.formGroup.valid) {
        const obraSocialSent: ObraSocial = {
          id: this.obraSocial().id,
          name: this.obraSocial().name
        };

        this.obraSocialService.updateObraSocial(obraSocialSent).subscribe(
          (obraSocial) => {
            alert('Obra social actualizada: ' + obraSocial.name);
            this.onClose();
            window.location.reload();
          });
      }
    }
  }
}
