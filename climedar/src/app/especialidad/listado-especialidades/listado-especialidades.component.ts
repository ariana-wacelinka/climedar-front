import { Component, signal, WritableSignal } from '@angular/core';
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
    MatNoDataRow
  ],
  templateUrl: './listado-especialidades.component.html',
  styleUrl: './listado-especialidades.component.scss'
})
export class ListadoEspecialidadesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  especialidades = signal<Especialidad[]>([]);
  displayedColumns: string[] = ["nombre", "edit"];
  filterValue = signal<string>('');

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
    this.especialidadService.getEspecailidadesFiltered(this.pageInfo().currentPage, this.filterValue().trim().toLowerCase()).subscribe(response => {
      this.especialidades.set(response.especialidades);
      this.pageInfo.set(response.pageInfo);
    });
  }

  applyFilter(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value);
    this.loadEspecialidades();
  }

  info_especialidad(especialidad: Especialidad) {
    console.log(especialidad);
    const dialogRef = this.dialog.open(InfoEspecialidadComponent, {
      maxWidth: '330px',
      height: 'auto',
      data: { id: especialidad.id, name: especialidad.name, code: especialidad.code, description: especialidad.description }
    });
  }

  editEspecialidad(especialidad: Especialidad) {
    const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: { id: especialidad.id, name: especialidad.name, code: especialidad.code, description: especialidad.description }
    });
  }

  createEspecialidad() {
    this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }

  eliminarEspecialidad(id: string) {
    this.especialidadService.deleteEspecialidad(id)
      .subscribe(success => {
        if (success) {
          window.location.reload();
        } else {
          console.log('Error al eliminar la especialidad');
        }
      });
  }

  volver() {
    window.history.back();
  }
}
