import { Component, signal, WritableSignal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import { MatFormField, MatFormFieldModule, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogServicioComponent } from '../dialog-servicio/dialog-servicio.component';
import { infoServicioComponent } from '../info-servicio/info-servicio.component';
import { ServiciosMedicosService } from '../services/servicio/servicios-medicos.service';
import { PageInfo } from '../../shared/models/extras.models';
import { MedicalService, MedicalServiceResponse } from '../models/services.models';
import { map } from 'rxjs';

@Component({
  selector: 'app-listado-servicios',
  imports: [
    CenteredCardComponent,
    MatButtonModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatMenu,
    MatMenuItem,
    MatPrefix,
    MatRow,
    MatRowDef,
    MatTable,
    PaginatorComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuTrigger,
    MatNoDataRow,
    MatHeaderCellDef,
  ],
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.scss'
})
export class ListadoServiciosComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["nombre", "precio", "duracionEstimada", "edit"];
  servicios = signal<MedicalServiceResponse[]>([]);
  filterValue = signal<string>('');

  constructor(private dialog: MatDialog,
    private serviciosMedicosService: ServiciosMedicosService,
  ) { this.loadServicios(); }

  formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match![1] ? match![1].replace('H', ' hs') : '';
    const minutes = match![2] ? match![2].replace('M', ' mins') : '';
    return `${hours} ${minutes}`.trim();
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.serviciosMedicosService.getAllServiciosMedicos(page, this.filterValue().trim().toLowerCase()).pipe(
      map(response => response)
    ).subscribe(response => {
      this.pageInfo.set(response.pageInfo);
      this.servicios.set(response.services);
    });
  }

  loadServicios() {
    this.serviciosMedicosService.getAllServiciosMedicos(this.pageInfo().currentPage, this.filterValue().trim().toLowerCase()).subscribe(response => {
      this.pageInfo.set(response.pageInfo);
      this.servicios.set(response.services);
    });
  }

  applyFilter(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value);
    this.loadServicios();
  }

  deleteServicio(id: string) {
    this.serviciosMedicosService.deleteMedicalService(id).subscribe(() => {
      this.loadServicios();
    });
    window.location.reload();
  }

  editServicio(servicio: MedicalService, specialityId: string) {
    this.dialog.open(DialogServicioComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {
        id: servicio.id,
        name: servicio.name,
        description: servicio.description,
        price: servicio.price,
        estimatedDuration: servicio.estimatedDuration,
        serviceType: servicio.serviceType,
        specialityId: specialityId
      }
    });
  }

  createServicio() {
    this.dialog.open(DialogServicioComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  servicioInfo(servicio: MedicalService) {
    this.dialog.open(infoServicioComponent, {
      data: {
        id: servicio.id,
        code: servicio.code,
        name: servicio.name,
        description: servicio.description,
        price: servicio.price,
        estimatedDuration: servicio.estimatedDuration,
        serviceType: servicio.serviceType,
        specialityId: servicio.specialityId
      }
    });
  }

  volver() {
    window.history.back();
  }
}
