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
import {InfoPaqueteComponent} from '../info-paquete/info-paquete.component';

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
    {id: 0, nombre: 'Paquete Básico', descripcion: 'Incluye Consulta General y Análisis de Sangre', precio: 700, servicios: [
      {id: 0, nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30'},
      {id: 1, nombre: 'Análisis de Sangre', descripcion: 'Análisis completo de sangre', precio: 300, duracionEstimada: '00:30'},
      {id: 2, nombre: 'Radiografía', descripcion: 'Radiografía de cualquier parte del cuerpo', precio: 800, duracionEstimada: '00:30'},
      {id: 3, nombre: 'Ecografía', descripcion: 'Ecografía de cualquier parte del cuerpo', precio: 1000, duracionEstimada: '00:30'},
      {id: 4, nombre: 'Fisioterapia', descripcion: 'Sesión de fisioterapia', precio: 600, duracionEstimada: '00:30'},
      {id: 5, nombre: 'Consulta Especialista', descripcion: 'Consulta con especialista', precio: 700, duracionEstimada: '00:45'},
      {id: 6, nombre: 'Terapia Ocupacional', descripcion: 'Sesión de terapia ocupacional', precio: 400, duracionEstimada: '00:30'},
      {id: 7, nombre: 'Terapia Física', descripcion: 'Sesión de terapia física', precio: 500, duracionEstimada: '00:30'},
      {id: 8, nombre: 'Consulta Nutricional', descripcion: 'Consulta con nutricionista', precio: 300, duracionEstimada: '00:30'},
      {id: 9, nombre: 'Consulta Psicológica', descripcion: 'Consulta con psicólogo', precio: 600, duracionEstimada: '00:45'}
    ]},
    {id: 1, nombre: 'Paquete Radiografía', descripcion: 'Incluye Radiografía y Consulta General', precio: 1200, servicios: [{id: 1, nombre: 'Radiografía', descripcion: 'Radiografía de cualquier parte del cuerpo', precio: 800, duracionEstimada: '00:30'}, {id: 0, nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30'}]},
    {id: 2, nombre: 'Paquete Completo', descripcion: 'Incluye Consulta General, Radiografía y Análisis de Sangre', precio: 1500, servicios: [{id: 0, nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30'}, {id: 1, nombre: 'Radiografía', descripcion: 'Radiografía de cualquier parte del cuerpo', precio: 800, duracionEstimada: '00:30'}, {id: 2, nombre: 'Análisis de Sangre', descripcion: 'Análisis completo de sangre', precio: 300, duracionEstimada: '00:30'}]},
    {id: 3, nombre: 'Paquete Ecografía', descripcion: 'Incluye Ecografía y Consulta General', precio: 1300, servicios: [{id: 3, nombre: 'Ecografía', descripcion: 'Ecografía de cualquier parte del cuerpo', precio: 1000, duracionEstimada: '00:30'}, {id: 0, nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30'}]},
    {id: 4, nombre: 'Paquete Fisioterapia', descripcion: 'Incluye Fisioterapia y Consulta General', precio: 1000, servicios: [{id: 4, nombre: 'Fisioterapia', descripcion: 'Sesión de fisioterapia', precio: 600, duracionEstimada: '00:30'}, {id: 0, nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30'}]}
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
    this.dialog.open(InfoPaqueteComponent, {
      data: {
        id: number,
        nombre: this.dataSource.data[number].nombre,
        precio: this.dataSource.data[number].precio,
        servicios: this.dataSource.data[number].servicios
      }
    });
  }
}
