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
    SPECIALIST = 'Consulta especializada',
    EXAMS = 'Exámen médico',
    SURGERY = 'Cirugía',
    THERAPY = 'Terapia y tratamientos varios'
}

export enum PaymentMethods {
    CASH = 'CASH',
    DEBIT = 'DEBIT_CARD',
    CREDIT = 'CREDIT_CARD',
    TRANSFER = 'TRANSFER',
    CDNI = 'CUENTA_DNI',
    MP = 'MERCADO_PAGO', 
}