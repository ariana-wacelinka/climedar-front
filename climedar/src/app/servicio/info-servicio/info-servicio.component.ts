import {Component, Inject, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {DialogServicioComponent} from '../dialog-servicio/dialog-servicio.component';
import { MedicalService } from '../models/services.models';
import { EspecialidadService } from '../../especialidad';
import { ServiceType } from '../../shared/models/extras.models';

@Component({
  selector: 'app-info-servicio',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './info-servicio.component.html',
  styleUrl: './info-servicio.component.scss'
})
export class infoServicioComponent {
  servicio = signal<MedicalService>({});
  minutos :string = '00';
  horas :string = '00';
  servicioName = signal<string>;
  tipoServicio = '';

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<infoServicioComponent>,
    public specialityService: EspecialidadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number,
      code: string,
      name: string,
      description: string,
      price: number,
      estimatedDuration: number,
      serviceType: string,
      specialityId: number,
    }
  ) {    
    this.tipoServicio = ServiceType[data.serviceType as keyof typeof ServiceType];

    this.servicio.set({
      id: data.id.toString(),
      code: data.code,
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      estimatedDuration: data.estimatedDuration.toString(),
      serviceType: data.serviceType,
      specialityId: data.specialityId.toString()
    });
    
    this.specialityService.getEspecialidadesById(data.specialityId).subscribe(response => {
      this.servicioName(response.name!);
    });
  }

  formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match![1] ? match![1].replace('H', ' hs') : '';
    const minutes = match![2] ? match![2].replace('M', ' mins') : '';
    return `${hours} ${minutes}`.trim();
  }  

  onClose() {
    this.dialogRef.close();
  }

  onModify(){
    this.dialogRef.close(this.servicio);
    this.dialog.open(DialogServicioComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        price: this.data.price,
        estimatedDuration: this.data.estimatedDuration,
        serviceType: this.data.serviceType,
        specialityId: this.data.specialityId
      }
    });
  }
}