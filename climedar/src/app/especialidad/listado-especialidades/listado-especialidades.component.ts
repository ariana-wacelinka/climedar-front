import {Component, ViewChild} from '@angular/core';
import {CenteredCardComponent} from "../../shared/components";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {PaginatorComponent} from "../../shared/components/paginator/paginator.component";
import {MatDialog} from '@angular/material/dialog';
import {DialogEspecialidadComponent} from '../dialog-especialidad/dialog-especialidad.component';

@Component({
  selector: 'app-listado-especialidades',
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
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    PaginatorComponent,
    MatMenuTrigger
  ],
  templateUrl: './listado-especialidades.component.html',
  styleUrl: './listado-especialidades.component.scss'
})
export class ListadoEspecialidadesComponent {
  currentPage = 1;
  pageSize = 5;
  totalItems = 30;

  onPageChange(page: number) {
    this.currentPage = page;
  }

  //Esto despues se reemplaza por el sort que hizo Lu
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: string[] = ["nombre", "edit"];
  dataSource = new MatTableDataSource([
    {nombre: 'Cardiologia', number: 0},
    {nombre: 'Traumatologia', number: 1},
    {nombre: 'Cirugia general', number: 2},
    {nombre: 'Ginecologia', number: 3},
    {nombre: 'Pediatria', number: 4}
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

  editEspecialidad(number: number) {
    this.dialog.open(DialogEspecialidadComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {id: number, nombre: this.dataSource.data[number].nombre}
    });
  }

  createEspecialidad(){
    this.dialog.open(DialogEspecialidadComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }
}
