export interface Payment {
    id: string;
    paymentMethod: string;
    paymentDate: string;
    amount: number;
    consultation: {
        id: string;
        patient: {
            name: string;
            surname: string;
        };
    };
}