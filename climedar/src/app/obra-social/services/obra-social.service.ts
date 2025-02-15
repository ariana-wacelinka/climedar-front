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
    console.log(obraSocial);
    const body = {
      query: `
      mutation CreateMedicalSecure($name: String!) {
        createMedicalSecure(medicalSecure: {name: $name}) {
          name
          id
        }
      }
    `,
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

  getAllMedicalSecures(page: number): Observable<{ medicalSecures: ObraSocial[], pageInfo: PageInfo }> {
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

    return this.http.post<{ data: { getAllMedicalSecures: { medicalSecures: ObraSocial[], pageInfo: PageInfo } } }>(
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
        mutation UpdateMedicalSecure($id: ID!, $name: String!) {
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

  deleteMedicalSecure(id: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        mutation DeleteMedicalSecure($id: ID!) {
          deleteMedicalSecure(id: $id)
        }`,
      variables: {
        id
      }
    };

    return this.http.post<{ data: { deleteMedicalSecure: boolean } }>(
      'http://localhost:443/apollo-federation',
      body,
      { headers }
    ).pipe(
      map(response => response.data.deleteMedicalSecure)
    );
  }
}
