import { Component, inject, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormField, MatHint, MatLabel, MatPrefix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ServiciosMedicosService } from '../services/servicio/servicios-medicos.service';
import { MedicalService } from '../models/services.models';
import { MatSelectModule } from '@angular/material/select';
import { Especialidad, EspecialidadService } from '../../especialidad';
import { ServiceType } from '../../shared/models/extras.models';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-servicio',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    ReactiveFormsModule,
    MatPrefix,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.scss'
})
export class DialogServicioComponent {
  tipoServicio = Object.entries(ServiceType).map(([key, value]) => ({
    key,
    value
  }));

  servicio = signal<MedicalService | null>(null);
  filteredEspecialidadOptions: Observable<Especialidad[]> | undefined;
  medicalServiceId = signal<boolean>(false);

  especialidades = signal<Especialidad[]>([]);
  especialidad = new FormControl<Especialidad | null>(null);

  formGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    estimatedDuration: new FormControl('', Validators.required),
    serviceType: new FormControl('', [Validators.required]),
    specialityId: new FormControl('', [Validators.required])
  });

  snackbar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    private serviciosMedicosService: ServiciosMedicosService,
    private specialityService: EspecialidadService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      id?: string,
      name?: string,
      description?: string,
      price?: string,
      estimatedDuration?: string,
      serviceType?: string,
      specialityId?: string
    }
  ) {
    console.log('Data:', this.data);
    if (this.data && this.data.id) {
      this.medicalServiceId.set(true);

      let estimatedDuration = '';
      if (this.data.estimatedDuration && this.data.estimatedDuration.includes("PT")) {
        const match = this.data.estimatedDuration.match(/PT(\d+H)?(\d+M)?/);
        const horas = match![1] ? match![1].replace("H", "") : "00";
        const minutos = match![2] ? match![2].replace("M", "") : "00";
        estimatedDuration = `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
      }

      this.formGroup.patchValue({
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        price: this.data.price,
        estimatedDuration: estimatedDuration,
        serviceType: this.data.serviceType,
        specialityId: this.data.specialityId
      });
    }

    this.specialityService.getAllEspecialidades(1).subscribe(response => {
      this.especialidades.set(response.especialidades);
    });
  }

  ngOnInit() {
    this.filteredEspecialidadOptions = this.especialidad.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.specialityService.getEspecialidadesByNombre(title).pipe(
          map((especiliades: Especialidad[]) => {
            return especiliades;
          })
        );
      }),
    );
  }

  displayEspecialidad(especialidad: Especialidad | undefined): string {
    return especialidad ? especialidad.name! : '';
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
    this.formGroup.controls.specialityId.setValue(event.option.value.id);
    console.log('Especialidad seleccionada:', event.option.value.id);
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
    console.log('Form value:', this.formGroup.value);
    if (!this.data.id || this.data.id.trim() === '') {
      console.log('Ejecutando creación, form value:', this.formGroup.value);
      const servicioMedico: MedicalService = {
        id: '',
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description!,
        price: this.formGroup.value.price!,
        estimatedDuration: this.formatTime(this.formGroup.value.estimatedDuration!),
        serviceType: this.formGroup.value.serviceType!,
        specialityId: this.formGroup.value.specialityId!
      };

      if (this.formGroup.valid) {
        this.serviciosMedicosService.createMedicalService(servicioMedico).subscribe(response => {
          console.log(response);
          this.snackbar.open('Servicio creado correctamente', 'Cerrar', { duration: 1000 });
          this.dialogRef.close();
        }, error => {
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al crear servicio' } });
          console.log('Error al crear servicio', error);
        });
      }
    } else {
      const servicioMedico: MedicalService = {
        id: this.formGroup.value.id!,
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description!,
        price: this.formGroup.value.price!,
        estimatedDuration: this.formatTime(this.formGroup.value.estimatedDuration!),
        serviceType: this.formGroup.value.serviceType!,
        specialityId: this.formGroup.value.specialityId!
      };

      if (this.formGroup.valid) {
        this.serviciosMedicosService.updateMedicalService(servicioMedico).subscribe(response => {
          console.log(response);
          this.snackbar.open('Servicio editado correctamente', 'Cerrar', { duration: 1000 });
          this.dialogRef.close();
        }, error => {
          this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al editar servicio' } });
          console.log('Error al editar servicio', error);
        });
      }
    }
  }

  formatTime(horaString: string): string {
    const [horas, minutos] = horaString.split(":").map(Number);
    return `PT${horas ? horas + "H" : ""}${minutos ? minutos + "M" : ""}`;
  }
}
