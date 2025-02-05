import { Doctor } from "../../doctors/models/doctor.models";

export interface Turno {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    state: string;
    timeOfShifts: string;
    place: string;
    doctor: Doctor;
}