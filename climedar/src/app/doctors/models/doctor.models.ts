import { Persona } from '../../shared/persona';
import { Especialidad } from "../../especialidad";

export interface Doctor extends Persona {
    sueldo?: string; //podria no ponerse porque no se usa mas alla de la creacion por ahora
    especialidad?: Especialidad;
}