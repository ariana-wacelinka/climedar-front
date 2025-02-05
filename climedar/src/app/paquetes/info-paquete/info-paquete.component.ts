import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatDivider} from '@angular/material/divider';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
}

@Component({
  selector: 'app-info-paquete',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatMenuTrigger,
    MatNoDataRow,
    MatDivider,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix
  ],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.scss'
})
export class InfoPaqueteComponent {
  displayedColumns: string[] = ["nombre", "precio", "duracionEstimada"];

  public paquete: {
    id: number;
    nombre: string;
    precio: number;
    servicios: Servicio[];
  };

  dataSource: MatTableDataSource<Servicio>;

  constructor(
    public dialogRef: MatDialogRef<InfoPaqueteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number,
      nombre: string,
      precio: number,
      servicios: Servicio[]
    }) {
    this.paquete = {
      id: this.data.id,
      nombre: this.data.nombre,
      precio: this.data.precio,
      servicios: this.data.servicios
    }

    this.dataSource = new MatTableDataSource(this.data.servicios);
  }

  onClose() {
    this.dialogRef.close();
  }

  onModify() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
