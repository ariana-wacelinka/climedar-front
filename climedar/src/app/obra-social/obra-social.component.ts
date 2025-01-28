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
import {MatIcon} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatButton} from '@angular/material/button';

// noinspection AngularUnusedComponentImport
@Component({
  selector: 'app-obra-social',
  imports: [
    CenteredCardComponent,
    MatTable,
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
    MatIcon,
    MatPaginator,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
  ],
  templateUrl: './obra-social.component.html',
  styleUrl: './obra-social.component.scss'
})
export class ObraSocialComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  displayedColumns: string[] = ['nombre'];
  dataSource = new MatTableDataSource([
    {nombre: 'OSPE'},
    {nombre: 'OSDE'},
    {nombre: 'PAMI'},
    {nombre: 'IOMA'},
    {nombre: 'OSECAC'},
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

  openDialog() {

  }
}
