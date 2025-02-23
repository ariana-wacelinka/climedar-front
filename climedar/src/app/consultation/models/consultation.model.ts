import { Doctor } from "../../doctors/models/doctor.models";
import { Paciente } from "../../patients/models/paciente.models";

export interface CreateConsultation {
    description: string;
    medicalServicesId: String[];
    observation: string;
    patientId: String;
    shiftId?: String;
    doctorId?: String;
}

export interface Consultation {
    id: string;
    finalPrice: number;
}

export interface ConsultationResponse {
    id: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    date: Date;
    isPaid: boolean;
    finalPrice: number;
    doctor?: Doctor;
    patient?: Paciente;
    shiftId?: String;
}