import { Component, inject, signal, WritableSignal } from '@angular/core';
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
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatDialog } from '@angular/material/dialog';
import { InfoPaqueteComponent } from '../info-paquete/info-paquete.component';
import { DialogPaqueteComponent } from '../dialog-paquete/dialog-paquete.component';
import { PageInfo } from '../../shared/models/extras.models';
import { PackageResponse } from '../models/package.models';
import { PackageService } from '../services/package.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado-paquetes',
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
    MatNoDataRow,
    MatMenuTrigger,
    MatHeaderCellDef,
    LoaderComponent
  ],
  templateUrl: './listado-paquetes.component.html',
  styleUrl: './listado-paquetes.component.scss'
})
export class ListadoPaquetesComponent {
  isLoading = true;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  packages = signal<PackageResponse[]>([]);
  displayedColumns: string[] = ["name", "price", "edit"];
  filterValue = signal<string>('');
  snackbar = inject(MatSnackBar);

  constructor(private dialog: MatDialog,
    private packageService: PackageService) {
    packageService.getAllPackages(this.pageInfo().currentPage).subscribe(response => {
      this.packages.set(response.packages);
      this.pageInfo.set(response.pageInfo);
      this.isLoading = false;
    });
  }

  private loadPaquetes() {
    this.packageService.getAllPackages(this.pageInfo().currentPage).subscribe(response => {
      console.log(response.pageInfo.totalItems);
      this.packages.set(response.packages);
      this.pageInfo.set(response.pageInfo);
    });
  }

  editPaquete(paquete: PackageResponse) {
    console.log(paquete);
    this.dialog.open(DialogPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {
        id: paquete.id,
        name: paquete.name,
        servicesIds: paquete.services!.map(service => service.id!),
        specialityId: paquete.speciality!.id!
      }
    }).afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPaquetes();
      }, 1500);
    });
  }

  createPaquete(): void {
    const dialogRef = this.dialog.open(DialogPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    }).afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPaquetes();
      }, 1500);
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    if (this.filterValue().trim() === '') {
      this.packageService.getAllPackages(page).subscribe(response => {
        this.packages.set(response.packages);
        this.pageInfo.set(response.pageInfo);
      });
    } else {
      this.packageService.getPackagesByName(page, this.filterValue().trim().toLowerCase()).subscribe(response => {
        this.packages.set(response.packages);
        this.pageInfo.set(response.pageInfo);
      });
    }
  }

  paqueteInfo(paquete: PackageResponse) {
    this.dialog.open(InfoPaqueteComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: { id: paquete.id }
    });
  }

  deletePaquete(id: number) {
    this.packageService.deletePackage(id).subscribe(response => {
      this.snackbar.open('Paquete eliminado exitosamente', 'Cerrar', { duration: 1000 });
      console.log(response)

      setTimeout(() => {
        this.loadPaquetes();
      }, 1500);
    });
  }

  applyFilter(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value);

    this.packageService.getPackagesByName(this.pageInfo().currentPage, this.filterValue().trim().toLowerCase()).subscribe(response => {
      this.packages.set(response.packages);
      this.pageInfo.set(response.pageInfo);
    });
  }

  volver() {
    window.history.back();
  }
}
