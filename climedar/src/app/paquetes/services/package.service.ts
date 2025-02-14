import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PageInfo } from '../../shared/models/extras.models';
import { Package, PackageRequest, PackageResponse } from '../models/package.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })

  constructor(private httpClient: HttpClient,
    private apollo: Apollo) { }

  public createPackage(paquete: PackageRequest): Observable<PackageResponse> {
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

    return this.httpClient.post<{ data: { createPackage: PackageResponse } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.createPackage)
    );
  }

  public getAllPackages(page: number): Observable<{ pageInfo: PageInfo, packages: Package[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        query MyQuery2 {
          getAllMedicalPackages(input: {page: ${page}, size: 10}) {
            packages {
              code
              estimatedDuration
              id
              name
              price
              services {
                id
                name
                price
                estimatedDuration
              }
            }
            pageInfo {
              currentPage
              totalItems
              totalPages
            }
          }
        }`,
    };

    return this.httpClient.post<{ data: { getAllMedicalPackages: { pageInfo: PageInfo, packages: Package[] } } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.getAllMedicalPackages)
    );
  }

  public deletePackage(id: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation MyMutation {
          deleteMedicalPackage(id: ${id})
        }`,
    };

    return this.httpClient.post<{ data: { deleteMedicalPackage: boolean } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.deleteMedicalPackage)
    );
  }

  public updatePackage(paquete: PackageRequest): Observable<PackageResponse> {
    console.log(paquete);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation UpdateMedicalPackage($id: ID!, $name: String!, $servicesIds: [ID!]!){
          updateMedicalPackage(id: $id, input: {name: $name, servicesIds: $servicesIds}){
            id
            name
            }
          }`,
      variables: {
        id: paquete.id,
        name: paquete.name,
        servicesIds: paquete.servicesIds
      }
    };

    return this.httpClient.post<{ data: { updatePackage: PackageResponse } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.updatePackage)
    );
  }
}
