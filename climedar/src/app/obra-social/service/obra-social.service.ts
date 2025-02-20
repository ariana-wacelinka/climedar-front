import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { MedcialSecure } from '../models/medicalSecure.model';
import { ObraSocial } from '../models/obra-social.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageInfo } from '../../shared/models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  constructor(private apollo: Apollo,
    private http: HttpClient
  ) { }

  getMedicalSecures(): Observable<MedcialSecure[]> {
    return this.apollo.query({
      query: gql`
        query {
          getAllMedicalSecures(pageRequest: {page: 1, size: 10}) {
            medicalSecures {
              id
              name
            }
          }
        }
      `
    }).pipe(
      map((response: any) => response.data.getAllMedicalSecures.medicalSecures)
    );
  }

  createObraSocial(obraSocial: ObraSocial): Observable<ObraSocial> {
    const mutation = gql`
      mutation CreateMedicalSecure($name: String!) {
        createMedicalSecure(medicalSecure: {name: $name}) {
          name
          id
        }
      }
    `;

    return this.apollo.mutate<{ createMedicalSecure: ObraSocial }>({
      mutation,
      variables: {
        name: obraSocial.name
      }
    }).pipe(
      map(response => response.data!.createMedicalSecure)
    );
  }

  getObrasSocialesFiltro(page: number, name: string): Observable<{ medicalSecures: ObraSocial[]; pageInfo: PageInfo }> {
    const query = gql`
    query GetAllMedicalSecures($page: Int!, $name: String) {
      getAllMedicalSecures(
        pageRequest: { page: $page, size: 5 },
        specification: { name: $name }
      ) {
        medicalSecures {
          id
          name
        }
        pageInfo {
          currentPage
          totalItems
          totalPages
        }
      }
    }
  `;

    return this.apollo.query<{ getAllMedicalSecures: {medicalSecures: ObraSocial[], pageInfo: PageInfo;}}>({
      query,
      variables: { page, name }
    }).pipe(map(response => {return response.data!.getAllMedicalSecures;}));
  }


  getAllMedicalSecures(page: number): Observable<{ medicalSecures: ObraSocial[], pageInfo: PageInfo }> {
    const query = gql`
      query GetAllMedicalSecures($page: Int!) {
        getAllMedicalSecures(pageRequest: {page: $page, size: 5}) {
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
      }`;

    return this.apollo.query<{ getAllMedicalSecures: { medicalSecures: ObraSocial[], pageInfo: PageInfo } }>({
      query,
      variables: { page }
    }).pipe(
      map(response => response.data.getAllMedicalSecures)
    );
  }

  updateObraSocial(obraSocial: ObraSocial): Observable<ObraSocial> {
    const mutation = gql`
      mutation UpdateMedicalSecure($id: ID!, $name: String!) {
        updateMedicalSecure(id: $id, medicalSecure: {name: $name}) {
          name
          id
        }
      }
    `;

    return this.apollo.mutate<{ updateMedicalSecure: ObraSocial }>({
      mutation,
      variables: {
        id: obraSocial.id,
        name: obraSocial.name
      }
    }).pipe(
      map(response => response.data!.updateMedicalSecure)
    );
  }

  deleteMedicalSecure(id: number): Observable<boolean> {
    const mutation = gql`
      mutation DeleteMedicalSecure($id: ID!) {
        deleteMedicalSecure(id: $id)
      }
    `;

    return this.apollo.mutate<{ deleteMedicalSecure: boolean }>({
      mutation,
      variables: { id }
    }).pipe(
      map(response => response.data!.deleteMedicalSecure)
    );
  }
}
