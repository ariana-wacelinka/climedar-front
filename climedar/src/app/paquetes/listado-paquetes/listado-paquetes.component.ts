import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { MatButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogServicioComponent } from '../../servicio/dialog-servicio/dialog-servicio.component';
import { infoServicioComponent } from '../../servicio/info-servicio/info-servicio.component';
import { InfoPaqueteComponent } from '../info-paquete/info-paquete.component';
import { DialogPaqueteComponent } from '../dialog-paquete/dialog-paquete.component';
import { PageInfo } from '../../shared/models/extras.models';
import { Package, PackageResponse } from '../models/package.models';
import { PackageService } from '../services/package.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-listado-paquetes',
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
    MatSortHeader,
    MatTable,
    PaginatorComponent,
    MatNoDataRow,
    MatMenuTrigger,
    MatHeaderCellDef
  ],
  templateUrl: './listado-paquetes.component.html',
  styleUrl: './listado-paquetes.component.scss'
})
export class ListadoPaquetesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  packages = signal<PackageResponse[]>([]);
  displayedColumns: string[] = ["name", "price", "edit"];
  dataSource = new MatTableDataSource();

  constructor(private dialog: MatDialog,
    private packageService: PackageService) {
    packageService.getAllPackages(this.pageInfo().currentPage).subscribe(response => {
      this.packages.set(response.packages);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.packages()
    });
  }

  editPaquete(paquete: PackageResponse) {
    this.dialog.open(DialogPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {
        id: paquete.id,
        name: paquete.name,
        servicesIds: paquete.services!.map(service => service.id!),
      }
    });
  }

  createPaquete(): void {
    const dialogRef = this.dialog.open(DialogPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage + 1);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.packageService.getAllPackages(page).subscribe(response => {
      this.packages.set(response.packages);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = this.packages()
    });
  }

  paqueteInfo(paquete: PackageResponse) {
    this.dialog.open(InfoPaqueteComponent, {
      data: {
        id: paquete.id,
        code: paquete.code,
        name: paquete.name,
        services: paquete.services,
        price: paquete.price,
        estimatedDuration: paquete.estimatedDuration,
      }
    });
  }
  
  deletePaquete(id: number) {
    this.packageService.deletePackage(id).subscribe(response => {
      console.log(response)
    });
    window.location.reload();
  }
}
