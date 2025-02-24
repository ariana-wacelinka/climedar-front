import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, DoCheck, inject, signal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatosContactoComponent, DatosDireccionComponent, DatosPersonalesComponent } from '../../shared/components';
import { DatosProfesionalesComponent } from './datos-profesionales/datos-profesionales.component';
import { DoctorService } from '../service/doctor.service';
import { Doctor } from '../models/doctor.models';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-alta-doctor',
  imports: [
    CenteredCardComponent,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DatosPersonalesComponent,
    DatosContactoComponent,
    DatosDireccionComponent,
    DatosProfesionalesComponent
  ],
  templateUrl: './alta-doctor.component.html',
  styleUrl: './alta-doctor.component.scss'
})
export class AltaDoctorComponent {
  public doctorId = signal<string>('');
  public doctorForm = new FormGroup({});
  private snackBar = inject(MatSnackBar);
  isLoading = false;

  constructor(private doctorService: DoctorService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.doctorId.set(navigation?.extras.state?.['id']);
    console.log('doctorId', this.doctorId());
  }

  ngOnInit() {
    if (this.isNumber(this.doctorId())) {
      this.isLoading = true;
      const id = new FormControl(this.doctorId(), [Validators.required]);
      this.doctorForm.addControl('id', id);
      this.doctorService.getDoctorById(this.doctorId()).subscribe(
        (response) => {
          console.log('Doctor obtenido', response);
          this.doctorForm.patchValue(response);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Ha habido un error, intentelo mas tarde' } });
          console.log('Error al obtener doctor', error);
        }
      );
    }
  }

  public isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  public guardar() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      this.doctorForm.markAsDirty();
      return;
    }

    if (this.isNumber(this.doctorId())) {
      this.doctorService.updateDoctor((this.doctorForm.value as Doctor)).subscribe(
        (response) => {
          console.log('Doctor actualizado', response);
          this.router.navigate(['/medico/listado']);
        },
        (error) => {
          console.error('Error al actualizar doctor', error);
        }
      );
    } else {
      console.log('doctor:' + JSON.stringify(this.doctorForm.value as Doctor).replace(/"([^"]+)":/g, '$1:'));
      this.doctorService.createDoctor(this.doctorForm.value).subscribe(
        (response) => {
          console.log('Doctor creado', response);
          this.snackBar.open('Doctor creado correctamente', 'Cerrar', { duration: 2000 })
          this.router.navigate(['/medico/listado']);
        },
        (error) => {
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Ha habido un error al crear el doctor' } });
          console.error('Error al crear doctor', error);
        }
      );
      console.log(this.doctorForm.value);
    }

  }

  public cancelar() {
    if (this.doctorForm.dirty) {
      this.dialog.open(ConfirmationDialogComponent, { data: { message: '¿Estás seguro de que deseas cancelar? Los cambios se perderán.' } }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          window.history.back();
        }
      });
    } else {
      window.history.back();
    }
  }

  onFormChanges(form: FormGroup) {
    if (Object.keys(form.controls).includes('street')) {
      this.doctorForm.addControl('address', form);
    } else {
      Object.keys(form.controls).forEach(key => {
        this.doctorForm.addControl(key, form.controls[key]);
      });
    }
    console.log('onFormChanges ', this.doctorForm.value);
  }
}
