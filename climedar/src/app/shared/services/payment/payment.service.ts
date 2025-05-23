import { AuthService } from './../../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private apollo: Apollo, private authService: AuthService
  ) {
  }

  createPayment(paymentMethod: string, consultationId: string): Observable<Blob> {
    const apiUrl = `${this.paymentUrl}/api/payments`;
    const HEADERS = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    const body = {
      consultationId: consultationId,
      paymentMethod: paymentMethod,
    }
    return this.http.post(apiUrl, body, { responseType: 'blob', headers: HEADERS });
  }

  getRevenues(fromDate: String = '', toDate: String = '', revenueType: string = '', originName: string = '', date: String = '', serviceType: string = '', specialityName: string = ''): Observable<{ name: string, value: number }[]> {
    const REVENUES = `
          query GetAllRevenuesPieChart {
          getAllRevenuesPieChart(
              specification: {
                  ${date && `date: "${date}",`}
                  fromDate: "${fromDate}",
                  toDate: "${toDate}",
                  ${specialityName && `specialityName: "${specialityName}",`}
                  ${serviceType && `serviceType: ${serviceType},`}
                  revenueType: ${revenueType == "RANGE" ? "DAILY" : revenueType},
                  originName: ${originName}
              }
          ) {
              name
              value
          }
      }
    `
    return this.apollo.query<{ getAllRevenuesPieChart: { name: string, value: number }[] }>({
      query: gql(REVENUES)
    }).pipe(
      map(response => response.data.getAllRevenuesPieChart)
    );
  }

  getDatesRevenues(fromDate: String = '', toDate: String = '', revenueType: string = ''): Observable<{ date: string, value: number }[]> {
    const QUERY = `
    query {
    getAllRevenuesLineChart(
        fromDate: "${fromDate}"
        toDate: "${toDate}"
        revenueType: ${revenueType}
    ) {
        date
        value
    }
}`

    return this.apollo.query<{ getAllRevenuesLineChart: { date: string, value: number }[] }>({
      query: gql(QUERY)
    }).pipe(
      map(response => response.data.getAllRevenuesLineChart)
    );
  }

  getAllPayments(page: number, startDate: string, endDate: string): Observable<{ payments: Payment[], pageInfo: PageInfo }> {
    const query = gql`
        query GetAllPayments {
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
    console.log(query);
    return this.apollo.query<{ getAllPayments: { payments: Payment[], pageInfo: PageInfo } }>({
      query: query
    }).pipe(
      map(response => response.data.getAllPayments)
    );
  }

  loadPayments(page: number): Observable<{ payments: Payment[], pageInfo: PageInfo }> {
    const query = gql`
        query GetAllPayments {
          getAllPayments(
            pageRequest: {page: ${page}, size: 5}
          ) {
            payments {
              id
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
    console.log(query);
    return this.apollo.query<{ getAllPayments: { payments: Payment[], pageInfo: PageInfo } }>({
      query: query
    }).pipe(
      map(response => response.data.getAllPayments)
    );
  }

  cancelPayment(payment: Payment): Observable<boolean> {
    const mutation = gql`
      mutation CancelPayment {
        cancelPayment(id: ${payment.id}) {
          success
        }
      }
    `;
    return this.apollo.mutate<{ cancelPayment: { success: boolean } }>({
      mutation: mutation,
    }).pipe(
      map(response => response.data?.cancelPayment.success ?? false)
    );
  }

  getInvoiceByPayment(id: string): Observable<Blob> {
    const apiUrl = `${this.paymentUrl}/api/invoices/payment/${id}`;
    console.log('apiUrl', apiUrl);
    const HEADERS = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(apiUrl, { responseType: 'blob', headers: HEADERS });
  }

  getReceiptByPayment(id: string): Observable<Blob> {
    const apiUrl = `${this.paymentUrl}/api/payments/${id}/receipt`;
    console.log('apiUrl', apiUrl);
    const HEADERS = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(apiUrl, { responseType: 'blob', headers: HEADERS });
  }
}
