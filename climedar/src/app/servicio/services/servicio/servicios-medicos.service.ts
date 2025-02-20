import { Injectable } from '@angular/core';
import { PageInfo } from '../../../shared/models/extras.models';
import { MedicalService, MedicalServiceResponse } from '../../models/services.models';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ServiciosMedicosService {
  constructor(private apollo: Apollo) { }

  public deleteMedicalService(id: string): Observable<boolean> {
    const mutation = gql`
      mutation deleteMedicalService($id: ID!) {
        deleteMedicalService(id: $id)
      }
    `;

    return this.apollo.mutate<{ deleteMedicalService: boolean }>({
      mutation,
      variables: {
        id
      }
    }).pipe(
      map(response => response.data!.deleteMedicalService)
    );
  }

  public createMedicalService(medicalService: MedicalService): Observable<MedicalService> {
    const mutation = gql`
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
    `;

    return this.apollo.mutate<{ createMedicalService: MedicalService }>({
      mutation,
      variables: {
        description: medicalService.description,
        name: medicalService.name,
        estimatedDuration: medicalService.estimatedDuration,
        price: Number(medicalService.price),
        serviceType: medicalService.serviceType,
        specialityId: medicalService.specialityId
      }
    }).pipe(
      map(response => response.data!.createMedicalService)
    );
  }

  public updateMedicalService(medicalService: MedicalService): Observable<MedicalServiceResponse> {
    const mutation = gql`
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
      }
    `;

    return this.apollo.mutate<{ updateMedicalService: MedicalServiceResponse }>({
      mutation,
      variables: {
        id: medicalService.id,
        description: medicalService.description,
        name: medicalService.name,
        estimatedDuration: medicalService.estimatedDuration,
        price: Number(medicalService.price),
        serviceType: medicalService.serviceType,
        specialityId: medicalService.specialityId
      }
    }).pipe(
      map(response => response.data!.updateMedicalService)
    );
  }

  public getAllServiciosMedicos(page: number, name: string = ''): Observable<{ pageInfo: PageInfo, services: MedicalServiceResponse[] }> {
    const query = gql`
      query getAllMedicalServices($page: Int!, $name: String!) {
        getAllMedicalServices(
          pageRequest: { page: $page, size: 5 }
          specification: { name: $name }
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
      }
    `;

    return this.apollo.query<{ getAllMedicalServices: { pageInfo: PageInfo, services: MedicalServiceResponse[] } }>({
      query,
      variables: {
        page: page,
        name: name
      }
    }).pipe(
      map(response => response.data!.getAllMedicalServices)
    );
  }

  public getServiciosMedicos(name: string = "", specialityId: string = "", page: number = 1): Observable<{ services: MedicalService[], pageInfo: PageInfo }> {
    const query = gql`
      query getAllMedicalServices($page: Int!, $name: String!, $specialityId: String!) {
        getAllMedicalServices(
          pageRequest: { page: $page, size: 10 }
          specification: { name: $name, specialityId: $specialityId }
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
      query,
      variables: {
        page: page,
        name: name,
        specialityId: specialityId
      }
    }).valueChanges.pipe(
      map(result => result.data.getAllMedicalServices)
    );
  }

  public getAllServiciosMedicosFiltro(page: number, specialityId: string, name: string = ''): Observable<{ pageInfo: PageInfo, services: MedicalServiceResponse[] }> {
    const query = gql`
      query getAllMedicalServices($page: Int!, $name: String!, $specialityId: String!) {
        getAllMedicalServices(
          pageRequest: { page: $page, size: 5 }
          specification: { name: $name, specialityId: $specialityId }
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
    `;

    return this.apollo.query<{ getAllMedicalServices: { pageInfo: PageInfo, services: MedicalServiceResponse[] } }>({
      query,
      variables: {
        page: page,
        name: name,
        specialityId: specialityId
      }
    }).pipe(
      map(response => response.data!.getAllMedicalServices)
    );
  }
}
