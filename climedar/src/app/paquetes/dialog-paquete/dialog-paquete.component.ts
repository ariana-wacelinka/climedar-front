import {Component, Inject, model, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatDivider} from '@angular/material/divider';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
}

@Component({
  selector: 'app-dialog-paquete',
  templateUrl: './dialog-paquete.component.html',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatMenuTrigger,
    MatNoDataRow,
    MatDivider,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix,
    FormsModule,
    ReactiveFormsModule,
    MatCheckbox
  ],
  styleUrls: ['./dialog-paquete.component.scss']
})
export class DialogPaqueteComponent {
  readonly indeterminate = model(false);

  displayedColumns: string[] = ["select", "nombre", "precio", "duracionEstimada"];
  dataSource = new MatTableDataSource([
    {nombre: 'Consulta General', descripcion: 'Consulta médica general', precio: 500, duracionEstimada: '00:30', number: 0},
    {nombre: 'Radiografía', descripcion: 'Radiografía de cualquier parte del cuerpo', precio: 800, duracionEstimada: '00:30', number: 1},
    {nombre: 'Análisis de Sangre', descripcion: 'Análisis completo de sangre', precio: 300, duracionEstimada: '00:30', number: 2},
    {nombre: 'Ecografía', descripcion: 'Ecografía de cualquier parte del cuerpo', precio: 1000, duracionEstimada: '01:00', number: 3},
    {nombre: 'Fisioterapia', descripcion: 'Sesión de fisioterapia', precio: 600, duracionEstimada: '01:00', number: 4}
  ]);

  formGroup = new FormGroup({
    nombre: new FormControl ('', Validators.required),
    descripcion: new FormControl ('', Validators.required),
    precio: new FormControl ('', Validators.required),
    duracionEstimada: new FormControl ('', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$\n')])
  });

  formGroup2 = new FormGroup({
    nombreEditar: new FormControl ('', Validators.required),
    descripcionEditar: new FormControl ('', [Validators.required, Validators.maxLength(150)]),
    precioEditar: new FormControl ('', Validators.required),
    duracionEstimadaEditar: new FormControl ('', Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<DialogPaqueteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { id?: number, nombre?: string, descripcion?: string, precio?: number, duracionEstimada?: number }
  ) {
    if (data.nombre != null && data.descripcion != null && data.precio != null && data.duracionEstimada != null){
      this.formGroup2.setValue({ nombreEditar: data.nombre, descripcionEditar: data.descripcion, precioEditar: data.precio.toString(), duracionEstimadaEditar: data.duracionEstimada.toString() });
    } else {
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onModify() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit() {
    if (this.data.id == null){
      if (this.formGroup.valid){
        alert('Paquete creado: ' + this.formGroup.value.nombre);
        this.onClose();
      }
    } else {
      if (this.formGroup2.valid){
        alert('Paquete editado: ' + this.formGroup2.value.nombreEditar);
        this.onClose();
      }
    }
  }
}
