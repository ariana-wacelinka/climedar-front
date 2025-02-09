import { Doctor } from "../../doctors/models/doctor.models";

export interface Turno {
    id?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    state?: TurnoState;
    timeOfShifts?: string;
    place?: string;
    doctor?: Doctor;
}

export enum TurnoState {
    LIBRE = 'AVAILABLE',
    CANCELADO = 'CANCELED',
    OCUPADO = 'OCCUPIED'
}