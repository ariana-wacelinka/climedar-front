import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PageInfo } from '../../shared/models/extras.models';
import { Package } from '../models/package.models';
import { query } from '@angular/animations';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })

  constructor(private httpClient: HttpClient,
    private apollo: Apollo) { }

  public createPackage(paquete: Package): Observable<Package> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(paquete);
    const body = {
      query: `
        mutation CreateMedicalPackage($name: String!, $servicesIds: [ID!]!){
          createMedicalPackage(input: {name: $name, servicesIds: $servicesIds}){
            id
            name
            }
          }`,
      variables: {
        name: paquete.name,
        servicesIds: paquete.servicesIds
      }
    };

    return this.httpClient.post<{ data: { createPackage: Package } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.createPackage)
    );
  }
}
