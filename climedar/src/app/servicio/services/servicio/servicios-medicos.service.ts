import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { PageInfo } from '../../../shared/models/extras.models';
import { MedicalService, MedicalServiceResponse } from '../../models/services.models';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ServiciosMedicosService {
  constructor(private http: HttpClient, private apollo: Apollo) {
  }

  public deleteMedicalService(id: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation deleteMedicalService($id: ID!) {
          deleteMedicalService(id: $id)
        }
      `,
      variables: {
        id
      }
    };

    return this.http.post<{ data: { deleteMedicalService: boolean } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.deleteMedicalService)
    );
  }

  public createMedicalService(medicalService: MedicalService): Observable<MedicalService> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation createMedicalService(
          $description: String!, 
          $name: String!, 
          $estimatedDuration: String!, 
          $price: Float!, 
          $serviceType: ServiceType!, 
          $specialityId: ID!
        ) {
          createMedicalService(
            input: {
              description: $description, 
              name: $name, 
              estimatedDuration: $estimatedDuration, 
              price: $price, 
              serviceType: $serviceType, 
              specialityId: $specialityId
            }
          ) {
            id
            name
            description
            estimatedDuration
            price
            serviceType
            speciality {
              id
            } 
          }
        }
      `,
      variables: {
        description: medicalService.description,
        name: medicalService.name,
        estimatedDuration: medicalService.estimatedDuration,
        price: Number(medicalService.price),
        serviceType: medicalService.serviceType,
        specialityId: medicalService.specialityId
      }
    };

    console.log('Enviando mutación:', body);

    return this.http.post<{ data: { createMedicalService: MedicalService } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.createMedicalService)
    );
  }

  public updateMedicalService(medicalService: MedicalService): Observable<MedicalServiceResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation updateMedicalService($id: ID!,
          $description: String!,
          $name: String!, 
          $estimatedDuration: String!, 
          $price: Float!) {
            updateMedicalService(id: $id, 
              input: {description: $description, 
              name: $name, 
              estimatedDuration: $estimatedDuration, 
              price: $price}) {
                id
                name
            }
        }`,
      variables: {
        id: medicalService.id,
        description: medicalService.description,
        name: medicalService.name,
        estimatedDuration: medicalService.estimatedDuration,
        price: Number(medicalService.price),
        serviceType: medicalService.serviceType,
        specialityId: medicalService.specialityId
      }
    };

    return this.http.post<{ data: { updateMedicalService: MedicalServiceResponse } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.updateMedicalService)
    );
  }

  public getAllServiciosMedicos(page: number, name: string = ''): Observable<{ pageInfo: PageInfo, services: MedicalServiceResponse[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `{
          getAllMedicalServices(
          pageRequest: { page: ${page}, size: 10 }
          specification: { name: "${name}" }
          ) {
              services {
              serviceType
              price
              speciality {
                id
              }
              name
              estimatedDuration
              id
              description
              code
            }
              pageInfo {
                currentPage
                totalItems
                totalPages
              }
            }
      }`
    };
    return this.http.post<{ data: { getAllMedicalServices: { pageInfo: PageInfo, services: MedicalServiceResponse[] } } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => ({
        pageInfo: response.data.getAllMedicalServices.pageInfo,
        services: response.data.getAllMedicalServices.services
      }))
    );
  }

  public getServiciosMedicos(name: string = "", specialityId: string = "", page: number = 1): Observable<{ services: MedicalService[], pageInfo: PageInfo }> {
    const GET_SERVICIOS_MEDICOS = gql`
      query {
        getAllMedicalServices(
          pageRequest: { page: ${page}, size: 10 }
          specification: { name: "${name}", specialityId: "${specialityId}" }
        ) {
          services {
            id
            estimatedDuration
            price
            name
            code
            description
          }
          pageInfo {
            currentPage
            totalItems
            totalPages
          }
        }
      }
    `;

    return this.apollo.watchQuery<{ getAllMedicalServices: { services: MedicalService[], pageInfo: PageInfo } }>({
      query: GET_SERVICIOS_MEDICOS,
    }).valueChanges.pipe(
      map(result => result.data.getAllMedicalServices)
    );
  }

  getAllServiciosMedicosFiltro(page: number, specialityId: string, name: string = ''): Observable<{ pageInfo: PageInfo, services: MedicalServiceResponse[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        query MyQuery {
          getAllMedicalServices(
            pageRequest: {page: ${page}, size: 5}
            specification: { name: "${name}", specialityId: ${specialityId}}
          ) {
            services {
              id
              name
              price
              estimatedDuration
            }
            pageInfo {
              currentPage
              totalItems
              totalPages
            }
          }
        }
      `
    };

    return this.http.post<{ data: { getAllMedicalServices: { pageInfo: PageInfo, services: MedicalServiceResponse[] } } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => ({
        pageInfo: response.data.getAllMedicalServices.pageInfo,
        services: response.data.getAllMedicalServices.services
      }))
    );
  }
}
