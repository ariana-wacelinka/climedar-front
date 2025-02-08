import {Component, ViewChild} from '@angular/core';
import {CenteredCardComponent} from "../../shared/components";
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {Especialidad, EspecialidadService} from '../../especialidad';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
    MatMenuTrigger,
    MatHeaderCellDef,
    MatNoDataRow
  ],
  templateUrl: './listado-especialidades.component.html',
  styleUrl: './listado-especialidades.component.scss'
})
export class ListadoEspecialidadesComponent {
  currentPage = 1;
  pageSize = 5;
  totalItems = 30;
  especialidades: Especialidad[] = [];
  dataSource = new MatTableDataSource<Especialidad>([]);
  displayedColumns: string[] = ["nombre", "edit"];

  constructor(private dialog: MatDialog, private especialidadService: EspecialidadService) {};

  ngOnInit() {
    this.loadEspecialidades();
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  
  loadEspecialidades() {
    this.especialidadService.getAllEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
      this.dataSource.data = this.especialidades;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEspecialidad(especialidad: Especialidad) {
    const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {id: especialidad.id, name: especialidad.name, code: especialidad.code, description: especialidad.description}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEspecialidades();
      }
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
