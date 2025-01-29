import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, } from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {MatFormField} from '@angular/material/form-field';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-dialog-obrasocial',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-obrasocial.component.html',
  styleUrl: './dialog-obrasocial.component.scss'
})
export class DialogObrasocialComponent {
  nombre = new FormGroup('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<DialogObrasocialComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit() {

  }
}
