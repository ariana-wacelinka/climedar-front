import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Especialidad, EspecialidadService } from '../../especialidad';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { MatDialog } from '@angular/material/dialog';
import { DialogEspecialidadComponent } from '../dialog-especialidad/dialog-especialidad.component';
import { InfoEspecialidadComponent } from '../info-especialidad/info-especialidad.component';
import { PageInfo } from '../../shared/models/extras.models';
import { map } from 'rxjs';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado-especialidades',
  imports: [
    CenteredCardComponent,
    MatButtonModule,
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
    MatTable,
    PaginatorComponent,
    MatMenuTrigger,
    MatHeaderCellDef,
    MatNoDataRow,
    LoaderComponent
  ],
  templateUrl: './listado-especialidades.component.html',
  styleUrl: './listado-especialidades.component.scss'
})
export class ListadoEspecialidadesComponent {
  isLoading = true;
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  especialidades = signal<Especialidad[]>([]);
  displayedColumns: string[] = ["nombre", "edit"];
  filterValue = signal<string>('');
  snackbar = inject(MatSnackBar);

  constructor(private dialog: MatDialog, private especialidadService: EspecialidadService) { };

  ngOnInit() {
    this.loadEspecialidades();
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.especialidadService.getAllEspecialidades(page).pipe(
      map(response => response)
    ).subscribe(response => {
      this.especialidades.set(response.especialidades);
      this.pageInfo.set(response.pageInfo);
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  loadEspecialidades() {
    this.especialidadService.getEspecialidadesFiltered(this.pageInfo().currentPage, this.filterValue().trim().toLowerCase()).subscribe(response => {
      this.especialidades.set(response.especialidades);
      this.pageInfo.set(response.pageInfo);
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value);
    this.loadEspecialidades();
  }

  info_especialidad(especialidad: Especialidad) {
    console.log(especialidad);
    this.dialog.open(InfoEspecialidadComponent, {
      maxWidth: '330px',
      height: 'auto',
      data: { id: especialidad.id, name: especialidad.name, code: especialidad.code, description: especialidad.description }
    });
  }

  editEspecialidad(especialidad: Especialidad) {
    this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: { id: especialidad.id, name: especialidad.name, code: especialidad.code, description: especialidad.description }
    }).afterClosed().subscribe(() => {
      this.pageChange(1);
    });
  }

  createEspecialidad() {
    this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    }).afterClosed().subscribe(() => {
      this.pageChange(1);
    });
  }

  eliminarEspecialidad(id: string) {
    this.especialidadService.deleteEspecialidad(id)
      .subscribe(success => {
        if (success) {
          this.snackbar.open('Especialidad eliminada con éxito', 'Cerrar', { duration: 1000 });
          this.loadEspecialidades();
        } else {
          console.log('Error al eliminar la especialidad');
        }
      });
  }

  volver() {
    window.history.back();
  }
}
