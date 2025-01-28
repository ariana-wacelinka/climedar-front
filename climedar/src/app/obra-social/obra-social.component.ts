import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CenteredCardComponent} from '../shared/components';
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
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-obra-social',
  imports: [
    CenteredCardComponent,
    MatTable,
    MatSortModule,
    MatTableModule,
    MatColumnDef,
    MatPaginatorModule,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatPaginator,
    MatIcon,
    MatIconModule,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
  ],
  templateUrl: './obra-social.component.html',
  styleUrl: './obra-social.component.scss'
})
export class ObraSocialComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: string[] = ["nombre", "edit"];
  dataSource = new MatTableDataSource([
    {nombre: 'OSDOSIM', number: 0},
    {nombre: 'OSPE', number: 1},
    {nombre: 'OSDE', number: 2},
    {nombre: 'PAMI', number: 3},
    {nombre: 'IOMA', number: 4},
    {nombre: 'OSECAC', number: 5},
    {nombre: 'OSMATA', number: 6},
    {nombre: 'OSSEG', number: 7},
    {nombre: 'OSDIPP', number: 8},
    {nombre: 'OSDOP', number: 9},
    {nombre: 'OSDOSIM', number: 10},
    {nombre: 'OSDOS', number: 11},
  ]);

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    alert('Editando obra social ' + number);
  }

  createObraSocial(){

  }
}
