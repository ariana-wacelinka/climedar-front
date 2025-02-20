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
    recurringShift?: RecurringShift;
    shiftBuilder: ShiftBuilder;
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

export enum ShiftBuilder {
    REGULAR = 'REGULAR',
    RECURRING = 'RECURRING',
    OVERTIME = 'OVERTIME'
}

export function getShiftBuilderByValue(value: string): ShiftBuilder {
    switch (value) {
        case 'REGULAR': return ShiftBuilder.REGULAR;
        case 'RECURRING': return ShiftBuilder.RECURRING;
        case 'OVERTIME': return ShiftBuilder.OVERTIME;
        default: throw new Error('Invalid value');
    }
}
