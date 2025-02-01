import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {DialogServicioComponent} from '../dialog-servicio/dialog-servicio.component';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
}

@Component({
  selector: 'app-info-servicio',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './info-servicio.component.html',
  styleUrl: './info-servicio.component.scss'
})
export class infoServicioComponent {
  public servicio: { descripcion: string; precio: number; id: number; nombre: string; duracionEstimada: number };
  minutos :string = '00';
  horas :string = '00';

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<infoServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, nombre: string, descripcion: string, precio: number, duracionEstimada: number }
  ) {
  this.servicio = {
    id: this.data.id,
    nombre: this.data.nombre,
    descripcion: this.data.descripcion,
    precio: this.data.precio,
    duracionEstimada: this.data.duracionEstimada
    }

    this.data.duracionEstimada.toString().split(':').forEach((element: string, index: number) => {
      if(index == 0){
        if (element.startsWith('0')) {
          this.horas = element.charAt(1);
        } else {
          this.horas = element;
        }
      }else{
        if (element.startsWith('0')) {
          this.minutos = element.charAt(1);
        } else {
          this.minutos = element
        }
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onModify(){
    this.dialogRef.close(this.servicio);
    this.dialog.open(DialogServicioComponent, {
      width:'670px',
      minWidth: '350px',
      maxWidth: '90vw',
      data: { id: this.data.id, nombre: this.data.nombre, descripcion: this.data.descripcion, precio: this.data.precio, duracionEstimada: this.data.duracionEstimada }
    });
  }
}
