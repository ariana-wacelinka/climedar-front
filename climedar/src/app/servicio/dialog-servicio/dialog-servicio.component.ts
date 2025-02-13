import {Component, Inject, signal} from '@angular/core';
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
import {ServiciosMedicosService} from '../services/servicio/servicios-medicos.service';
import {MedicalService} from '../models/services.models';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {Especialidad, EspecialidadService} from '../../especialidad';
import {map} from 'rxjs';
import { ServiceType } from '../../shared/models/extras.models';

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
    MatSelectModule,
  ],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.scss'
})
export class DialogServicioComponent {
  tipoServicio = Object.entries(ServiceType).map(([key, value]) => ({
    key,
    value
  }));

  especialidades = signal<Especialidad[]>([]);
  
  formGroup = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    precio: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    duracionEstimada: new FormControl('', Validators.required),
    serviceType: new FormControl('', Validators.required),
    specialityId: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    private serviciosMedicosService: ServiciosMedicosService,
    private specialityService: EspecialidadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id?: string,
      nombre?: string,
      descripcion?: string,
      precio?: number,
      duracionEstimada?: string,
      serviceType?: string,
      specialityId?: string
    }
  ) {
    if (data) {
      this.formGroup.patchValue({
        id: data.id ?? '',
        nombre: data.nombre ?? '',
        descripcion: data.descripcion ?? '',
        precio: data.precio?.toString() ?? '',
        duracionEstimada: data.duracionEstimada ?? '',
        serviceType: data.serviceType ?? '',
        specialityId: data.specialityId ?? ''
      });
    }

    this.specialityService.getAllEspecialidades(1).pipe(
      map(response => response)
    ).subscribe(response => {
      this.especialidades.set(response.especialidades);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data.id == null) {
      const servicioMedico: MedicalService = {
        id: '',
        name: this.formGroup.value.nombre!,
        description: this.formGroup.value.descripcion!,
        price: this.formGroup.value.precio!,
        estimatedDuration: this.formatTime(this.formGroup.value.duracionEstimada!),
        serviceType: this.formGroup.value.serviceType!,
        specialityId: this.formGroup.value.specialityId!
      };

      if (this.formGroup.valid) {
        console.log(servicioMedico);
        this.serviciosMedicosService.createMedicalService(servicioMedico).subscribe(response => {
          console.log(response);
          alert('Servicio creado: ' + response);
          this.onClose();
        }, error => {
          console.error('Error al crear servicio', error);
          alert('Error al crear servicio');
        });
      }
    } else {
      const servicioMedico: MedicalService = {
        id: this.formGroup.value.id!,
        name: this.formGroup.value.nombre!,
        description: this.formGroup.value.descripcion!,
        price: this.formGroup.value.precio!,
        estimatedDuration: this.formatTime(this.formGroup.value.duracionEstimada!),
        serviceType: this.formGroup.value.serviceType!,
        specialityId: this.formGroup.value.specialityId!
      };

      if (this.formGroup.valid) {
        this.serviciosMedicosService.updateMedicalService(servicioMedico).subscribe(response => {
          console.log(response);
          alert('Servicio editado: ' + response);
          this.onClose();
        }, error => {
          console.error('Error al editar servicio', error);
          alert('Error al editar servicio');
        });
      }
    }
  }

  formatTime(horaString: string): string {
    const [horas, minutos] = horaString.split(":").map(Number);
    return `PT${horas ? horas + "H" : ""}${minutos ? minutos + "M" : ""}`;
  }
}
