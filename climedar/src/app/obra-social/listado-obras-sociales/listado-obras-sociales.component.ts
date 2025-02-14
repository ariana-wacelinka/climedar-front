import { AfterViewInit, Component, signal, ViewChild, WritableSignal, effect } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
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
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { DialogObrasocialComponent } from '../dialog-obrasocial/dialog-obrasocial.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatMenuModule } from '@angular/material/menu';
import { PageInfo } from '../../shared/models/extras.models';
import { ObraSocialService } from '../services/obra-social.service';
import { map } from 'rxjs';
import { ObraSocial } from '../models/obra-social.models';

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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
export class ListadoObrasSocialesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  obrasSociales = signal<ObraSocial[]>([]);
  displayedColumns: string[] = ["nombre", "edit"];
  dataSource = new MatTableDataSource<ObraSocial>([]);

  constructor(private dialog: MatDialog,
    public obraSocialService: ObraSocialService,
  ) {
    this.obraSocialService.getAllObrasSociales(this.pageInfo().currentPage).pipe(
      map(response => response)
    ).subscribe(response => {
      console.log(response);
      this.obrasSociales.set(response.obrasSociales);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = response.obrasSociales;
    });

    effect(() => {
      this.dataSource.data = this.obrasSociales();
    });
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.obraSocialService.getAllObrasSociales(page).pipe(
      map(response => response)
    ).subscribe(response => {
      this.obrasSociales.set(response.obrasSociales);
      this.pageInfo.set(response.pageInfo);
      this.dataSource.data = response.obrasSociales;
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage + 1);
  }

  editObraSocial(obrasocial: ObraSocial) {
    {
      this.dialog.open(DialogObrasocialComponent, {
        width: '670px',
        minWidth: '350px',
        maxWidth: '90vw',
        data: {
          id: obrasocial.id,
          nombre: obrasocial.name
        }
      });
    }
  }

  createObraSocial() {
    this.dialog.open(DialogObrasocialComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {}
    });
  }
}
