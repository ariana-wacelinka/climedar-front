import { Component, signal, WritableSignal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableModule
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
import { ObraSocialService } from '../service/obra-social.service';
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
  medicalSecures = signal<ObraSocial[]>([]);
  displayedColumns: string[] = ["nombre", "edit"];

  constructor(private dialog: MatDialog,
    public obraSocialService: ObraSocialService,
  ) { }

  ngOnInit() {
    this.obraSocialService.getAllMedicalSecures(this.pageInfo().currentPage).pipe(
      map(response => response)
    ).subscribe(response => {
      console.log(response);
      this.medicalSecures.set(response.medicalSecures);
      this.pageInfo.set(response.pageInfo);
    });
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.obraSocialService.getAllMedicalSecures(page).pipe(
      map(response => response)
    ).subscribe(response => {
      this.medicalSecures.set(response.medicalSecures);
      this.pageInfo.set(response.pageInfo);
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  editObraSocial(medicalSecure: ObraSocial) {
    {
      this.dialog.open(DialogObrasocialComponent, {
        width: '670px',
        minWidth: '350px',
        maxWidth: '90vw',
        data: {
          id: medicalSecure.id,
          name: medicalSecure.name
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

  deleteObraSocial(id: number) {
    this.obraSocialService.deleteMedicalSecure(id).subscribe(() => {
      console.log('Deleted');
      window.location.reload();
    });
  }
}
