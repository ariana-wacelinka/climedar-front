import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Especialidad, EspecialidadService} from '../../especialidad';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
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
        ReactiveFormsModule,
        MatHint,
        MatError
    ],
  templateUrl: './dialog-especialidad.component.html',
  styleUrl: './dialog-especialidad.component.scss'
})
export class DialogEspecialidadComponent {

  formGroup = new FormGroup({
    id: new FormControl (''),
    name: new FormControl ('', Validators.required),
    code: new FormControl ('', Validators.required),
    description: new FormControl ('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogEspecialidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, name?: string, code?:string, description?: string },
    private especialidadService: EspecialidadService,
  ) {
    if (data) {
      this.formGroup.patchValue({
        id: data.id ?? '',
        name: data.name ?? '',
        code: data.code ?? '',
        description: data.description ?? ''
      });
     }}

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.valid){
      if (this.data.id != null) {
        const especialidad: Especialidad = {
          id: this.formGroup.value.id!,
          name: this.formGroup.value.name!,
          description: this.formGroup.value.description!,
          code: this.formGroup.value.code!
        };
        console.log('Especialidad a modificar:', especialidad);

        this.especialidadService.updateEspecialidad(especialidad).subscribe(() => {
          console.log('Especialidad modificada:', especialidad);
          this.onClose();
          window.location.reload();
        });
      } else {
        const especialidad: Especialidad = {
          id: '',
          name: this.formGroup.value.name!,
          description: this.formGroup.value.description!,
          code: this.formGroup.value.code!
        };        

        this.especialidadService.createEspecialidad(especialidad).subscribe(() => {
          console.log('Especialidad creada:', especialidad);
          this.onClose();
          window.location.reload();
        });
      }
    }
  }
}
