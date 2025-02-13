import {Component, signal, ViewChild, WritableSignal} from '@angular/core';
import {CenteredCardComponent} from '../../shared/components';
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatFormField, MatFormFieldModule, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {PaginatorComponent} from '../../shared/components/paginator/paginator.component';
import {MatDialog} from '@angular/material/dialog';
import {DialogServicioComponent} from '../dialog-servicio/dialog-servicio.component';
import {infoServicioComponent} from '../info-servicio/info-servicio.component';
import { ServiciosMedicosService } from '../services/servicio/servicios-medicos.service';
import { PageInfo } from '../../shared/models/extras.models';
import { MedicalService, MedicalServiceResponse } from '../models/services.models';
import { map } from 'rxjs';

@Component({
  selector: 'app-listado-servicios',
  imports: [
    CenteredCardComponent,
    MatButton,
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
    MatSort,
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
  dataSource = new MatTableDataSource<MedicalService>([]);
  servicios= signal<MedicalService[]>([]);
  
  constructor(private dialog: MatDialog,
    private serviciosMedicosService: ServiciosMedicosService,
  ) {}

  ngOnInit() {
    this.loadServicios();
  }

  formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match![1] ? match![1].replace('H', ' hs') : '';
    const minutes = match![2] ? match![2].replace('M', ' mins') : '';
    return `${hours} ${minutes}`.trim();
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage + 1);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.serviciosMedicosService.getAllServiciosMedicos(page).pipe(
        map(response => response)
      ).subscribe(response => {
        this.pageInfo.set(response.pageInfo);
          const servicios : MedicalService[] = response.services.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            estimatedDuration: service.estimatedDuration,
            serviceType: service.serviceType,
            specialityId: service.speciality!.id
          }));
          this.dataSource.data = servicios
        })
  }

  loadServicios() {
    this.serviciosMedicosService.getAllServiciosMedicos(this.pageInfo().currentPage).subscribe(response => {
      this.dataSource.data = this.servicios()
      this.pageInfo.set(response.pageInfo);
      const servicios : MedicalService[] = response.services.map(service => ({
        id: service.id,
        code: service.code,
        name: service.name,
        description: service.description,
        price: service.price,
        estimatedDuration: service.estimatedDuration,
        serviceType: service.serviceType,
        specialityId: service.speciality!.id
      }));
      this.dataSource.data = servicios
    });
  }

  deleteServicio(id: string) {
    this.serviciosMedicosService.deleteMedicalService(id).subscribe(() => {
      this.loadServicios();
    });
    window.location.reload();
  }

  editServicio(servicio: MedicalService) {
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
        specialityId: servicio.specialityId
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
}
