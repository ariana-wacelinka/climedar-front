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
import { MatSelectModule } from '@angular/material/select';
import { Especialidad, EspecialidadService } from '../../especialidad';
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
  servicio = signal<MedicalService | null>(null);
  medicalServiceId = signal<boolean>(false);
  especialidades = signal<Especialidad[]>([]);
  formGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<DialogServicioComponent>,
    private serviciosMedicosService: ServiciosMedicosService,
    private specialityService: EspecialidadService,
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
    this.formGroup.addControl('name', new FormControl('', Validators.required));
    this.formGroup.addControl('description', new FormControl('', Validators.required));
    this.formGroup.addControl('price', new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]));
    this.formGroup.addControl('estimatedDuration', new FormControl('', Validators.required));

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
        name: this.data.name,
        description: this.data.description,
        price: this.data.price,
        estimatedDuration: estimatedDuration,
        serviceType: this.data.serviceType,
        specialityId: this.data.specialityId
      });

      const id = new FormControl(this.data.id, [Validators.required]);
      this.formGroup.addControl('id', id);
    } else {
      const serviceType = new FormControl('', [Validators.required]);
      this.formGroup.addControl('serviceType', serviceType);

      const specialityId = new FormControl('', [Validators.required]);
      this.formGroup.addControl('specialityId', specialityId);
    }

    this.specialityService.getAllEspecialidades(1).subscribe(response => {
      this.especialidades.set(response.especialidades);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const servicioData: MedicalService = {
        ...this.formGroup.value,
        estimatedDuration: this.formatTime((this.formGroup.value as MedicalService).estimatedDuration!)
      };

      if (this.medicalServiceId()) {
        console.log('Editando servicio', servicioData);
        this.serviciosMedicosService.updateMedicalService(servicioData).subscribe(response => {
          alert('Servicio editado: ' + response);
          window.location.reload();
          this.onClose();
        }, error => {
          console.error('Error al editar servicio', error);
          alert('Error al editar servicio');
        });
      } else {
        console.log('Creando servicio', servicioData);
        this.serviciosMedicosService.createMedicalService(servicioData).subscribe(response => {
          alert('Servicio creado: ' + response);
          window.location.reload();
          this.onClose();
        }, error => {
          console.error('Error al crear servicio', error);
          alert('Error al crear servicio');
        });
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  formatTime(horaString: string): string {
    const [horas, minutos] = horaString.split(":").map(Number);
    return `PT${horas ? horas + "H" : ""}${minutos ? minutos + "M" : ""}`;
  }
}
