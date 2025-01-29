import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, } from '@angular/material/dialog';
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

  constructor(
    public dialogRef: MatDialogRef<DialogObrasocialComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit() {

  }
}
