import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { 
  }

  createPayment(paymentMethod: string, consultationId: string): Observable<Blob> {
    const body = {
      consultationId: consultationId,
      paymentMethod: paymentMethod
    }
    return this.http.post('http://localhost:8085/api/public/payments', body, { responseType: 'blob' });
  }
}
