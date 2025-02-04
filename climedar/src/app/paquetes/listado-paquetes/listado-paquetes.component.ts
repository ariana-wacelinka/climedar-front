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
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {PaginatorComponent} from '../../shared/components/paginator/paginator.component';
import {MatDialog} from '@angular/material/dialog';
import {DialogServicioComponent} from '../../servicio/dialog-servicio/dialog-servicio.component';
import {infoServicioComponent} from '../../servicio/info-servicio/info-servicio.component';

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
  currentPage = 1;
  pageSize = 5;
  totalItems = 30;

  onPageChange(page: number) {
    this.currentPage = page;
  }

  //Esto despues se reemplaza por el sort que hizo Lu
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: string[] = ["nombre", "precio", "edit"];
  dataSource = new MatTableDataSource([
    {id: 0, nombre: 'Paquete Básico', descripcion: 'Incluye Consulta General y Análisis de Sangre', precio: 700, servicios: ['Consulta General', 'Análisis de Sangre']},
    {id: 1, nombre: 'Paquete Radiografía', descripcion: 'Incluye Radiografía y Consulta General', precio: 1200, servicios: ['Radiografía', 'Consulta General']},
    {id: 2, nombre: 'Paquete Completo', descripcion: 'Incluye Consulta General, Radiografía y Análisis de Sangre', precio: 1500, servicios: ['Consulta General', 'Radiografía', 'Análisis de Sangre']},
    {id: 3, nombre: 'Paquete Ecografía', descripcion: 'Incluye Ecografía y Consulta General', precio: 1300, servicios: ['Ecografía', 'Consulta General']},
    {id: 4, nombre: 'Paquete Fisioterapia', descripcion: 'Incluye Fisioterapia y Consulta General', precio: 1000, servicios: ['Fisioterapia', 'Consulta General']}
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

  editPaquete(number: number) {
    // this.dialog.open(DialogPaqueteComponent, {
    //   width:'670px',
    //   minWidth: '350px',
    //   maxWidth: '90vw',
    //   data: {id: number, nombre: this.dataSource.data[number].nombre, descripcion: this.dataSource.data[number].descripcion, precio: this.dataSource.data[number].precio, duracionEstimada: this.dataSource.data[number].duracionEstimada}
    // });
  }

  createPaquete(){
    // this.dialog.open(DialogPaqueteComponent, {
    //   width:'670px',
    //   minWidth: '350px',
    //   maxWidth: '90vw',
    //   data: {}
    // });
  }

  paqueteInfo(number: number) {
    // this.dialog.open(infoPaqueteComponent, {data: {id: number, nombre: this.dataSource.data[number].nombre, descripcion: this.dataSource.data[number].descripcion, precio: this.dataSource.data[number].precio, duracionEstimada: this.dataSource.data[number].duracionEstimada}
    // });
  }
}
