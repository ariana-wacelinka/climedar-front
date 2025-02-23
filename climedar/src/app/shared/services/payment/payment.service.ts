import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl = environment.paymentUrl;
  constructor(private http: HttpClient, private apollo: Apollo) { 
  }

  createPayment(paymentMethod: string, consultationId: string): Observable<Blob> {
    const body = {
      consultationId: consultationId,
      paymentMethod: paymentMethod
    }
    return this.http.post(this.paymentUrl, body, { responseType: 'blob' });
  }

  getRevenues(fromDate: String = '', toDate: String = '', revenueType: string = '', originName: string = '', date: String = '', serviceType: string  = '', specialityName: string  = ''): Observable<{ name: string, value: number }[]> {
    const REVENUES = `
          query MyQuery {
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
    console.log(REVENUES);
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
}
