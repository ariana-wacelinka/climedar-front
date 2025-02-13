import { MedcialSecure } from "../../obra-social/models/medicalSecure.model";
import { Persona } from "../../shared/persona";

export interface Paciente extends Persona {
    medicalSecure?: MedcialSecure;
}