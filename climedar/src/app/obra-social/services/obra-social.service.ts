import { Injectable, signal } from '@angular/core';
import { PageInfo } from '../../shared/models/extras.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObraSocial } from '../models/obra-social.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  constructor(public http: HttpClient) { }

  createObraSocial(obraSocial: ObraSocial): Observable<ObraSocial> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation CreateMedicalSecure {
          createMedicalSecure(medicalSecure: {name: $name}) {
            name
            id
          }
        }`,
      variables: {
        name: obraSocial.name
      }
    };

    return this.http.post<{ data: { createMedicalSecure: ObraSocial } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.createMedicalSecure)
    );
  }
  
  getAllObrasSociales(page: number): Observable<{ obrasSociales: ObraSocial[], pageInfo: PageInfo }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        query MyQuery {
          getAllMedicalSecures(pageRequest: {page: ${page}, size: 5}) {
            medicalSecures {
              name
              id
            }
            pageInfo {
              currentPage
              itemsPerPage
              totalItems
            }
          }
        }`
    };

    return this.http.post < { data: { getAllMedicalSecures: { obrasSociales: ObraSocial[], pageInfo: PageInfo } } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.getAllMedicalSecures)
    );
  }

  updateObraSocial(obraSocial: ObraSocial): Observable<ObraSocial> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation MyMutation {
          updateMedicalSecure(id: $id, medicalSecure: {name: $name}) {
            name
            id
          }
        }`,
      variables: {
        id: obraSocial.id,
        name: obraSocial.name
      }
    };

    return this.http.post<{ data: { updateMedicalSecure: ObraSocial } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.updateMedicalSecure)
    );
  }
}
