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
    CASH = 'Efectivo',
    DEBIT_CARD = 'Debito',
    CREDIT_CARD = 'Credito',
    TRANSFER = 'Transferencia',
    CUENTA_DNI = 'Cuenta DNI',
    MERCADO_PAGO = 'Mercado Pago', 
}