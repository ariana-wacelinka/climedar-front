import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { PageInfo } from '../../shared/models/extras.models';
import { Package, PackageRequest, PackageResponse } from '../models/package.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  constructor(private apollo: Apollo) { }

  createPackage(paquete: PackageRequest): Observable<PackageResponse> {
    const body = `
      mutation CreateMedicalPackage($name: String!, $servicesIds: [ID!]!, $specialityId: ID!) {
          createMedicalPackage(input: {name: $name, servicesIds: $servicesIds, specialityId: $specialityId}) {
            id
            name
          }
        }
      `,
      variables = {
        name: paquete.name,
        servicesIds: paquete.servicesIds,
        specialityId: paquete.specialityId
      };
    
    return this.apollo.mutate({
      mutation: gql`${body}`,
      variables: variables
    }).pipe(
      map(response => response.data!)
    );
  }

  getAllPackages(page: number): Observable<{ pageInfo: PageInfo, packages: Package[] }> {
    const query = gql`
      query GetAllMedicalPackages($page: Int!) {
        getAllMedicalPackages(input: {page: $page, size: 5, order: {field: "name", direction: ASC}}) {
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
      }
    `;

    return this.apollo.query<{ getAllMedicalPackages: { pageInfo: PageInfo, packages: Package[] } }>({
      query,
      variables: {
        page: page
      }
    }).pipe(
      map(response => response.data!.getAllMedicalPackages)
    );
  }

  deletePackage(id: number): Observable<boolean> {
    const mutation = gql`
      mutation DeleteMedicalPackage($id: ID!) {
        deleteMedicalPackage(id: $id)
      }
    `;

    return this.apollo.mutate<{ deleteMedicalPackage: boolean }>({
      mutation,
      variables: {
        id: id
      }
    }).pipe(
      map(response => response.data!.deleteMedicalPackage)
    );
  }

  updatePackage(paquete: PackageRequest): Observable<PackageResponse> {
    const mutation = gql`
      mutation UpdateMedicalPackage($id: ID!, $name: String!, $servicesIds: [ID!]!) {
        updateMedicalPackage(id: $id, input: {name: $name, servicesIds: $servicesIds}) {
          id
          name
        }
      }
    `;

    return this.apollo.mutate<{ updateMedicalPackage: PackageResponse }>({
      mutation,
      variables: {
        id: paquete.id,
        name: paquete.name,
        servicesIds: paquete.servicesIds
      }
    }).pipe(
      map(response => response.data!.updateMedicalPackage)
    );
  }

  getPackageById(id: number): Observable<PackageResponse> {
    const query = gql`
      query GetMedicalPackageById($id: ID!) {
        getMedicalPackageById(id: $id) {
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
      }
    `;

    return this.apollo.query<{ getMedicalPackageById: PackageResponse }>({
      query,
      variables: {
        id: id
      }
    }).pipe(
      map(response => response.data!.getMedicalPackageById)
    );
  }

  getPackagesByName(page: number, name:string): Observable<{ pageInfo: PageInfo, packages: Package[] }> {
    const query = gql`
      query GetAllMedicalPackages($page: Int!, $name: String!) {
        getAllMedicalPackages(input: {page: $page, size: 5, order: {field: "name", direction: ASC}}, name: $name) {
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
      }
    `;

    return this.apollo.query<{ getAllMedicalPackages: { pageInfo: PageInfo, packages: Package[] } }>({
      query,
      variables: {
        page: page,
        name: name
      }
    }).pipe(
      map(response => response.data!.getAllMedicalPackages)
    );
  }
}
