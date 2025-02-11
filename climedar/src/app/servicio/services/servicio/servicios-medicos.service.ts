import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageInfo } from '../../../shared/models/extras.models';
import { MedicalService } from '../../models/services.models';
import { map, Observable } from 'rxjs';
import {Apollo} from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ServiciosMedicosService {

  constructor(private http: HttpClient, private apollo: Apollo) {
  }

  public createMedicalService(medicalService: MedicalService): Observable<MedicalService> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation CreateMedicalService($code: String!, $description: String!, $name: String!, $estimatedDuration: String!, $price: String!, $serviceType: String!, $specialityId: String!) {
          createMedicalService(speciality: {code: $code, description: $description, name: $name, estimatedDuration: $estimatedDuration, price: $price, serviceType: $serviceType, specialityId: $specialityId}) {
            id
            code
            name
            description
            estimatedDuration
            price
            serviceType
            specialityId
          }
        }`,
      variables: {
        code: medicalService.code,
        description: medicalService.description,
        name: medicalService.name,
        estimatedDuration: medicalService.estimatedDuration,
        price: medicalService.price,
        serviceType: medicalService.serviceType,
        specialityId: medicalService.specialityId
      }
    };

    return this.http.post<{ data: { createMedicalService: MedicalService } }>(
      'http://localhost:8081/graphql',
      body,
      { headers }
    ).pipe(
      map(response => response.data.createMedicalService)
    );
  }


  public getServiciosMedicos(name: string = "", specialityId: string = "", page: number = 1): Observable<{ services: MedicalService[], pageInfo: PageInfo }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: `{
                getAllMedicalServices(
                  pageRequest: {page: ${page}, size: 10}
                  specification: {name: "${name}", specialityId: "${specialityId}"}
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
    }`
    }
    return this.http.post<{ data: { getAllMedicalServices: { services: MedicalService[], pageInfo: PageInfo } } }>(
      'http://localhost:8081/graphql',
      body,
      { headers }
    ).pipe(
      map(response => response.data.getAllMedicalServices)
    );
  }

}
