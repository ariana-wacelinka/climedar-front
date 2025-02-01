import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CenteredCardComponent} from '../../shared/components';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatButton} from '@angular/material/button';
import {DialogObrasocialComponent} from '../dialog-obrasocial/dialog-obrasocial.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginatorComponent} from '../../shared/components/paginator/paginator.component';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-obra-social',
  imports: [
    CenteredCardComponent,
    MatTable,
    MatSortModule,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    MatIconModule,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    PaginatorComponent,
    MatMenuModule,
  ],
  templateUrl: './listado-obras-sociales.component.html',
  styleUrl: './listado-obras-sociales.component.scss'
})
export class ListadoObrasSocialesComponent implements AfterViewInit {
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
    {nombre: 'OSDOSIM', number: 0},
    {nombre: 'OSPE', number: 1},
    {nombre: 'OSDE', number: 2},
    {nombre: 'PAMI', number: 3},
    {nombre: 'IOMA', number: 4}
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

  editObraSocial(number: number) {
    this.dialog.open(DialogObrasocialComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {id: number, nombre: this.dataSource.data[number].nombre}
    });
  }

  createObraSocial(){
    this.dialog.open(DialogObrasocialComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
      });
  }

  protected readonly Math = Math;
}
