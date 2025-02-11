export interface Persona {
    birthdate?: string,
    dni?: string,
    email?: string,
    gender: string,
    id: string,
    name: string,
    phone?: string,
    surname: string,
    address?: Address
}

export interface Address {
    street: string,
    number: string,
    apartment: string,
    floor: string
}