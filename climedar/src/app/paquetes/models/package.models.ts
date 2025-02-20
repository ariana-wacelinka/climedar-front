import { MedicalService } from "../../servicio/models/services.models";

export interface Package {
    id?: string,
    name?: string,
    specialityId?: string,
}

export interface PackageResponse extends Package {
    services?: MedicalService[],
    price?: number,
    estimatedDuration?: string,
    code?: string,
}

export interface PackageRequest extends Package { 
    servicesIds?: string[],
}