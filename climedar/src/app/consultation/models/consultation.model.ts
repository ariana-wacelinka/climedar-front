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

export interface ConsultationResponse{
    id: string;
    startTime: string;
    date: string;
    finalPrice: number;
    doctor?: {
        id: string;
        name: string;
        surname: string;
    };
    patient: {
        id: string;
        name: string;
        surname: string;
    }
}