import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TurnosService } from '../services/turnos-service/turnos.service';
import { TurnosDialogComponent } from '../turnos-dialog/turnos-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    DatePipe,
    CenteredCardComponent,
    MatButtonModule
],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  currentDate = new Date(2025, 0, 1);
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  monthDays: Date[] = [];
  emptyDays: number[] = [];
  especialidades: string[] = [];
  medicos: string[] = [];
  
  especialidadControl = new FormControl('');
  medicoControl = new FormControl('');

  constructor(
    private turnosService: TurnosService,
    private dialog: MatDialog
  ) {
    this.especialidades = this.turnosService.getEspecialidades();
    this.medicos = this.turnosService.getMedicos();
  }

  ngOnInit() {
    this.updateCalendar();
    
    this.especialidadControl.valueChanges.subscribe(value => {
      this.turnosService.filtrarTurnos(value || '', this.medicoControl.value || '');
    });

    this.medicoControl.valueChanges.subscribe(value => {
      this.turnosService.filtrarTurnos(this.especialidadControl.value || '', value || '');
    });
  }

  updateCalendar() {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  
    // Generar los días del mes
    this.monthDays = Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i + 1)
    );
  
    // Días vacíos al inicio
    const firstDayOfWeek = firstDay.getDay() || 7; // Ajustar inicio para lunes
    this.emptyDays = Array(firstDayOfWeek - 1).fill(0);
  
    // Días sobrantes al final
    const lastDayOfWeek = lastDay.getDay() || 7;
    const remainingDays = 7 - lastDayOfWeek;
    this.monthDays = [
      ...this.monthDays,
      ...Array.from({ length: remainingDays }, (_, i) => 
        new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, i + 1)
      )
    ];
  }
  

  changeMonth(direction: 'prev' | 'next') {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + (direction === 'prev' ? -1 : 1),
      1
    );
    this.updateCalendar();
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  tieneTurnos(fecha: Date): boolean {
    return this.turnosService.tieneTurnos(fecha);
  }

  openTurnosDialog(fecha: Date) {
    const turnos = this.turnosService.getTurnosDelDia(fecha);
    this.dialog.open(TurnosDialogComponent, {
      data: { fecha, turnos },
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh'
    });
  }

}
