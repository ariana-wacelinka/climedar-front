import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments';
import { Apollo, gql } from 'apollo-angular';
import { Payment } from '../../../facturacion/models/payment.model';
import { PageInfo } from '../../models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = environment.paymentUrl;
  constructor(private http: HttpClient,
    private apollo: Apollo
  ) {
  }

  createPayment(paymentMethod: string, consultationId: string): Observable<Blob> {
    const body = {
      consultationId: consultationId,
      paymentMethod: paymentMethod
    }
    return this.http.post(this.paymentUrl, body, { responseType: 'blob' });
  }

  getAllPayments(page: number, startDate: string, endDate: string): Observable<{payments: Payment[], pageInfo: PageInfo} > {
    const query = gql`
        query MyQuery {
          getAllPayments(
            pageRequest: {page: ${page}, size: 5}
            specification: {fromDate: "${startDate}", toDate: "${endDate}"}
          ) {
            payments {
              paymentMethod
              paymentDate
              amount
              consultation{
                id
                patient{
                    name
                    surname
                }
              }
            }
            pageInfo {
              totalPages
              totalItems
              currentPage
            }
          }
        }`;
    return this.apollo.query<{ getAllPayments: { payments: Payment[], pageInfo: PageInfo } }>({
      query: query
    }).pipe(
      map(response => response.data.getAllPayments)
    );
  }

  cancelPayment(payment: Payment): Observable<any> {
    const mutation = gql`
      mutation CancelPayment {
        cancelPayment(id: ${payment.id}) {
          success
          message
        }
      }
    `;
    return this.apollo.mutate({
      mutation: mutation,
    });
  }
}
