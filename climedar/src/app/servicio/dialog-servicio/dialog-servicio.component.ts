import { Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormField, MatHint, MatLabel, MatPrefix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ServiciosMedicosService } from '../services/servicio/servicios-medicos.service';
import { MedicalService } from '../models/services.models';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Especialidad, EspecialidadService } from '../../especialidad';
import { map } from 'rxjs';
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
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    estimatedDuration: new FormControl('', Validators.required),
    serviceType: new FormControl('', Validators.required),
    specialityId: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    private serviciosMedicosService: ServiciosMedicosService,
    private specialityService: EspecialidadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id?: string,
      name?: string,
      description?: string,
      price?: number,
      estimatedDuration?: string,
      serviceType?: string,
      specialityId?: string
    }
  ) {
    this.specialityService.getAllEspecialidades(1).subscribe(response => {
      this.especialidades.set(response.especialidades);
    });

    if (data) {
      let estimatedDuration = '';
      if (data.estimatedDuration && data.estimatedDuration.includes("PT")) {
        const match = data.estimatedDuration.match(/PT(\d+H)?(\d+M)?/);
        const horas = match![1] ? match![1].replace("H", "") : "00";
        const minutos = match![2] ? match![2].replace("M", "") : "00";
        estimatedDuration = `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
      }

      this.formGroup.patchValue({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price?.toString(),
        estimatedDuration: estimatedDuration,
        serviceType: data.serviceType,
        specialityId: data.specialityId
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
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
          alert('Servicio creado: ' + response);
          window.location.reload();
          this.onClose();
        }, error => {
          console.error('Error al crear servicio', error);
          alert('Error al crear servicio');
        });
      }
    } else {
      const servicioMedico: MedicalService = {
        id: this.formGroup.value.id!,
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description!,
        price: this.formGroup.value.price!,
        estimatedDuration: this.formatTime(this.formGroup.value.estimatedDuration!)
      };
      console.log('Ejecutando edición, form value:', servicioMedico);

      if (this.formGroup.valid) {
        this.serviciosMedicosService.updateMedicalService(servicioMedico).subscribe(response => {
          console.log(response);
          alert('Servicio editado: ' + response);
          window.location.reload();
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
