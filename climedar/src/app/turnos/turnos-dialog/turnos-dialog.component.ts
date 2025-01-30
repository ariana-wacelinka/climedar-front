import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Turno } from '../models/turno.models';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-turnos-dialog',
  imports: [
    MatDialogModule,
    MatCardModule,
    NgIf,
    NgFor,
    DatePipe
  ],
  templateUrl: './turnos-dialog.component.html',
  styleUrl: './turnos-dialog.component.scss'
})
export class TurnosDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TurnosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fecha: Date; turnos: Turno[] }
  ) {}
}
