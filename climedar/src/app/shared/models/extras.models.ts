export interface PageInfo {
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export enum DayOfWeek {
    MONDAY = 'Lunes',
    TUESDAY = 'Martes',
    WEDNESDAY = 'Miércoles',
    THURSDAY = 'Jueves',
    FRIDAY = 'Viernes',
    SATURDAY = 'Sábado',
    SUNDAY = 'Domingo'
}

export enum ServiceType{
    GENERAL = 'Consulta general',
    SPECIALIZED = 'Consulta especializada',
    EXAM = 'Exámen médico',
    SURGERY = 'Cirugía',
    THERAPY = 'Terapia y tratamientos varios'
}
