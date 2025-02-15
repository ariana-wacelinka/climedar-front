import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DialogPaqueteComponent } from '../dialog-paquete/dialog-paquete.component';
import { PackageResponse } from '../models/package.models';
import { Duration } from 'luxon';
import { ServiciosMedicosService } from '../../servicio/services/servicio/servicios-medicos.service';
import { MedicalService } from '../../servicio/models/services.models';
import { PageInfo } from '../../shared/models/extras.models';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { PackageService } from '../services/package.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-info-paquete',
  imports: [
    MatButton,
    CurrencyPipe,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatTableModule,
    MatListModule,
    PaginatorComponent,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.scss'
})
export class InfoPaqueteComponent {
  paquete = signal<PackageResponse | null>(null);
  servicios = signal<MedicalService[]>([]);
  dataSource = new MatTableDataSource<MedicalService>();
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  constructor(
    public dialogRef: MatDialogRef<InfoPaqueteComponent>,
    public dialog: MatDialog,
    public medicalService: ServiciosMedicosService,
    public packageService: PackageService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number,
    }) {
    this.packageService.getPackageById(this.data.id).subscribe((response) => {
      this.paquete.set(response);
      console.log(response);
      this.servicios.set(response.services!);
      this.dataSource.data = response.services!;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onModify() {
    this.onClose();
    this.dialog.open(DialogPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {
        id: this.paquete()!.id,
        name: this.paquete()!.name,
        servicesIds: this.paquete()!.services!.map((service) => service.id)
      }
    });
  }

  formatDurationTime(duration: string | null): string {
    return (!duration) ? 'Tiro error xd' : Duration.fromISO(duration).as('minutes') + ' min';
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage + 1);
  }

  pageChange(page: number) {
    this.medicalService.getAllServiciosMedicos(page).subscribe((response) => {
      this.servicios.set(response.services);
      this.pageInfo.set(response.pageInfo);
    });
  }
}
