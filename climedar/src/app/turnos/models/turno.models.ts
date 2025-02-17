import { Doctor } from "../../doctors/models/doctor.models";

export interface TurnoI {
    id?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    state?: TurnoState;
    timeOfShifts?: string;
    place?: string;
}

export enum TurnoState {
    LIBRE = 'AVAILABLE',
    CANCELADO = 'CANCELED',
    OCUPADO = 'OCCUPIED'
}

export interface Turno extends TurnoI {
    doctor?: Doctor;
}

export interface CreateTurno extends TurnoI {
    doctorId: string;
    recurringShift: RecurringShift;
}

export interface RecurringShift {
    startDate: string,
    endDate: string,
    validDays: ValidDays[],
}   

export enum ValidDays {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}
