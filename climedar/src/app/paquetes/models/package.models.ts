import { MedicalService } from "../../servicio/models/services.models";

export interface Package {
    id?: string,
    name?: string,
    servicesIds?: string[],
}