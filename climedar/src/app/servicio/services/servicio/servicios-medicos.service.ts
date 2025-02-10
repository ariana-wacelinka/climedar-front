import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageInfo } from '../../../shared/models/extras.models';
import { MedicalService } from '../../models/services.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosMedicosService {

  constructor(private http: HttpClient) { }

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
