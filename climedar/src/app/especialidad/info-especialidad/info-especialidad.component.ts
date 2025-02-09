import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Especialidad } from '../models';
import { DialogEspecialidadComponent } from '../dialog-especialidad/dialog-especialidad.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-info-this.speciality',
  imports: [MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './info-especialidad.component.html',
  styleUrl: './info-especialidad.component.scss'
})
export class InfoEspecialidadComponent {
  speciality: Especialidad;

  constructor(public dialogRef: MatDialogRef<InfoEspecialidadComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {id: string, name: string, code:string, description: string}) {
      this.speciality = data;
    }

  onModify() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
      width: '670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: {id: this.speciality.id, name: this.speciality.name, code: this.speciality.code, description: this.speciality.description}
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
