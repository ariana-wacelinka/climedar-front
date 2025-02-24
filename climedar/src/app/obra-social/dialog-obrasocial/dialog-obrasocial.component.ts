import { Component, inject, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ObraSocialService } from '../service/obra-social.service';
import { ObraSocial } from '../models/obra-social.models';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

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
    MatInput,
    MatError
  ],
  templateUrl: './dialog-obrasocial.component.html',
  styleUrl: './dialog-obrasocial.component.scss'
})
export class DialogObrasocialComponent {
  obraSocial = signal<ObraSocial>({ id: '', name: '' });
  formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required)
  });
  snackbar = inject(MatSnackBar);

  constructor(
    private dialogRef: MatDialogRef<DialogObrasocialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, name?: string },
    private obraSocialService: ObraSocialService,
    private dialog: MatDialog,
  ) {
    if (data.id && data.name) {
      console.log(data);
      this.obraSocial.set(data);
      this.formGroup.setValue({
        id: data.id,
        name: data.name
      });
    }
  }

  onClose() {
    if (this.formGroup.dirty) {
      this.dialog.open(ConfirmationDialogComponent, { data: { message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.' } }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const obraSocialSent: ObraSocial = {
        id: this.formGroup.get('id')?.value || '',
        name: this.formGroup.get('name')?.value || ''
      };

      if (!this.data.id) {
        this.obraSocialService.createObraSocial(obraSocialSent).subscribe({
          next: () => {
            this.snackbar.open('Obra Social creada correctamente', 'Cerrar', { duration: 1000 });
            setTimeout(() => {
              this.dialogRef.close();
            }, 1050);
          },
          error: (err) => {
            this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear la obra social' } });
            console.error('Error creating Obra Social:', err);
          }
        });
      } else {
        this.obraSocialService.updateObraSocial(obraSocialSent).subscribe({
          next: () => {
            this.snackbar.open('Obra Social actualizada correctamente', 'Cerrar', { duration: 1000 });
            setTimeout(() => {
              this.dialogRef.close();
            }, 1050);
          },
          error: (err) => {
            this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al actualizar la obra social' } });
            console.error('Error updating Obra Social:', err);
          }
        });
      }
    }
  }
}
