export interface CreateConsultation {
    description: string;
    medicalServicesId: String[];
    observation: string;
    patientId: String;
    shiftId?: String;
    doctorId?: String;
}