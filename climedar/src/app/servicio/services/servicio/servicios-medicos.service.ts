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
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })

  constructor(private http: HttpClient, private apollo: Apollo) { }

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

}
