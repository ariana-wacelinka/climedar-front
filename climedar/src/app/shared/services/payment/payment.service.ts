import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = environment.paymentUrl;
  constructor(private http: HttpClient) { 
  }

  createPayment(paymentMethod: string, consultationId: string): Observable<Blob> {
    const body = {
      consultationId: consultationId,
      paymentMethod: paymentMethod
    }
    return this.http.post(this.paymentUrl, body, { responseType: 'blob' });
  }
}
