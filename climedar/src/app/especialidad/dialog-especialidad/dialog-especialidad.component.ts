import { Component, inject, Inject } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { Especialidad, EspecialidadService } from '../../especialidad';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

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
    ReactiveFormsModule,
    MatHint,
    MatError
  ],
  templateUrl: './dialog-especialidad.component.html',
  styleUrl: './dialog-especialidad.component.scss'
})
export class DialogEspecialidadComponent {
  snackbar = inject(MatSnackBar);

  formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogEspecialidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, name?: string, code?: string, description?: string },
    private especialidadService: EspecialidadService,
    private dialog: MatDialog
  ) {
    if (data) {
      this.formGroup.patchValue({
        id: data.id ?? '',
        name: data.name ?? '',
        code: data.code ?? '',
        description: data.description ?? ''
      });
    }
  }

  onClose() {
    if (this.formGroup) {
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
      if (this.data.id != null) {
        const especialidad: Especialidad = {
          id: this.formGroup.value.id!,
          name: this.formGroup.value.name!,
          description: this.formGroup.value.description!,
          code: this.formGroup.value.code!
        };

        this.especialidadService.updateEspecialidad(especialidad).subscribe(() => {
          console.log('Especialidad modificada:', especialidad);
          this.snackbar.open('Especialidad modificada con éxito', 'Cerrar', { duration: 1000 });
          setTimeout(() => {
            this.dialogRef.close();
          }, 1050);
        });
      } else {
        const especialidad: Especialidad = {
          id: '',
          name: this.formGroup.value.name!,
          description: this.formGroup.value.description!,
          code: this.formGroup.value.code!
        };

        this.especialidadService.createEspecialidad(especialidad).subscribe({
          next: (especialidad: Especialidad) => {
            console.log('Especialidad creada:', especialidad);
            this.snackbar.open('Especialidad creada con éxito', 'Cerrar', { duration: 1000 });
            setTimeout(() => {
              this.dialogRef.close();
            }, 1050);
          },
          error: (err) => {
            console.error('Error al crear la especialidad:', err);
            this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear la especialidad' } });
          }
        });
      }
    }
  }
}
