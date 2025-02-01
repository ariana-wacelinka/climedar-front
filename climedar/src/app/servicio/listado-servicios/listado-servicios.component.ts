import {Component, ViewChild} from '@angular/core';
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
    MatSortHeader,
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
  currentPage = 1;
  pageSize = 5;
  totalItems = 30;

  onPageChange(page: number) {
    this.currentPage = page;
  }

  //Esto despues se reemplaza por el sort que hizo Lu
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: string[] = ["nombre", "precio", "duracionEstimada", "edit"];
  dataSource = new MatTableDataSource([
    {nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30', number: 0},
    {nombre: 'Radiografía', descripcion: 'Radiografía de cualquier parte del cuerpo', precio: 800, duracionEstimada: '00:30', number: 1},
    {nombre: 'Análisis de Sangre', descripcion: 'Análisis completo de sangre', precio: 300, duracionEstimada: '00:30', number: 2},
    {nombre: 'Ecografía', descripcion: 'Ecografía de cualquier parte del cuerpo', precio: 1000, duracionEstimada: '01:00', number: 3},
    {nombre: 'Fisioterapia', descripcion: 'Sesión de fisioterapia', precio: 600, duracionEstimada: '01:00', number: 4}
  ]);

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editServicio(number: number) {
    this.dialog.open(DialogServicioComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {id: number, nombre: this.dataSource.data[number].nombre, descripcion: this.dataSource.data[number].descripcion, precio: this.dataSource.data[number].precio, duracionEstimada: this.dataSource.data[number].duracionEstimada}
    });
  }

  createServicio(){
    this.dialog.open(DialogServicioComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  servicioInfo(number: number) {
    this.dialog.open(infoServicioComponent, {data: {id: number, nombre: this.dataSource.data[number].nombre, descripcion: this.dataSource.data[number].descripcion, precio: this.dataSource.data[number].precio, duracionEstimada: this.dataSource.data[number].duracionEstimada}
    });
  }
}
