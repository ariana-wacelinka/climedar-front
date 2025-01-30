import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Turno } from '../../models/turno.models';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private turnos: Turno[] = [
    // 30 de enero 2025
    {
      id: 1,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-30",
      hora: "09:00",
      duracion: 30,
    },
    {
      id: 2,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-30",
      hora: "09:30",
      duracion: 30,
    },
    {
      id: 3,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-30",
      hora: "10:00",
      duracion: 30,
    },
    {
      id: 4,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-30",
      hora: "09:00",
      duracion: 30,
    },
    {
      id: 5,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-30",
      hora: "09:30",
      duracion: 30,
    },
    {
      id: 6,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-30",
      hora: "10:00",
      duracion: 30,
    },
    {
      id: 7,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-30",
      hora: "14:00",
      duracion: 30,
    },
    {
      id: 8,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-30",
      hora: "14:30",
      duracion: 30,
    },
    {
      id: 9,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-30",
      hora: "15:00",
      duracion: 30,
    },
    // 31 de enero 2025
    {
      id: 10,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-31",
      hora: "11:00",
      duracion: 30,
    },
    {
      id: 11,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-31",
      hora: "11:30",
      duracion: 30,
    },
    {
      id: 12,
      medico: "Dr. Lucio Guerra",
      especialidad: "Neurología",
      fecha: "2025-01-31",
      hora: "12:00",
      duracion: 30,
    },
    {
      id: 13,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-31",
      hora: "15:00",
      duracion: 30,
    },
    {
      id: 14,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-31",
      hora: "15:30",
      duracion: 30,
    },
    {
      id: 15,
      medico: "Dra. Ana García",
      especialidad: "Cardiología",
      fecha: "2025-01-31",
      hora: "16:00",
      duracion: 30,
    },
    {
      id: 16,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-31",
      hora: "09:00",
      duracion: 30,
    },
    {
      id: 17,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-31",
      hora: "09:30",
      duracion: 30,
    },
    {
      id: 18,
      medico: "Dr. Juan Pérez",
      especialidad: "Pediatría",
      fecha: "2025-01-31",
      hora: "10:00",
      duracion: 30,
    }
  ];

  private especialidades = ["Neurología", "Cardiología", "Pediatría"];
  private medicos = ["Dr. Lucio Guerra", "Dra. Ana García", "Dr. Juan Pérez"];

  private turnosFiltrados = new BehaviorSubject<Turno[]>(this.turnos);

  getTurnos(): Observable<Turno[]> {
    return this.turnosFiltrados.asObservable();
  }

  getEspecialidades(): string[] {
    return this.especialidades;
  }

  getMedicos(): string[] {
    return this.medicos;
  }

  filtrarTurnos(especialidad: string = '', medico: string = ''): void {
    const turnosFiltrados = this.turnos.filter(turno => {
      if (especialidad && turno.especialidad !== especialidad) return false;
      if (medico && turno.medico !== medico) return false;
      return true;
    });
    this.turnosFiltrados.next(turnosFiltrados);
  }

  getTurnosDelDia(fecha: Date): Turno[] {
    return this.turnosFiltrados.value.filter(turno => 
      new Date(turno.fecha).toDateString() === fecha.toDateString()
    ).sort((a, b) => a.hora.localeCompare(b.hora));
  }

  tieneTurnos(fecha: Date): boolean {
    return this.turnosFiltrados.value.some(turno => 
      new Date(turno.fecha).toDateString() === fecha.toDateString()
    );
  }

}
