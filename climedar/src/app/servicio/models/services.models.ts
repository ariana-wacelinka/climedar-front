export interface Services {
    id?: string,
    code?: string
    name?: string
    estimatedDuration?: string
    price?: string
}

export interface MedicalService extends Services {
    description?: string,
    serviceType?: string,
    specialityId?: string,
} 

export interface MedicalServiceResponse extends Services {
    description?: string,
    serviceType?: string,
    speciality?: {
        id?: string
    }
} 

export interface MedicalPackage {
    services?: [MedicalService]
}