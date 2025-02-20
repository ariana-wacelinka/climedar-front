import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Especialidad } from '../models';
import { map, Observable } from 'rxjs';
import { PageInfo } from '../../shared/models/extras.models';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  constructor(private http: HttpClient, private apollo: Apollo) { }

  public updateEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    const mutation = `
      mutation UpdateSpeciality($id: ID!, $code: String!, $description: String!, $name: String!) {
        updateSpeciality(id: $id, speciality: {
          code: $code, 
          description: $description, 
          name: $name
        }) {
          id
          code
          name
          description
        }
      }`;

    return this.apollo.mutate<{ updateSpeciality: Especialidad }>({
      mutation: gql`${mutation}`,
      variables: {
        id: especialidad.id,
        code: especialidad.code,
        description: especialidad.description,
        name: especialidad.name
      }
    }).pipe(
      map((response: any) => response.data.updateSpeciality)
    );
  }

  public createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    const mutation = gql`
      mutation CreateSpeciality($code: String!, $description: String!, $name: String!) {
        createSpeciality(speciality: {code: $code, description: $description, name: $name}) {
          id
          code
          name
          description
        }
      }`;

    return this.apollo.mutate<{ createSpeciality: Especialidad }>({
      mutation,
      variables: {
        code: especialidad.code,
        description: especialidad.description,
        name: especialidad.name
      }
    }).pipe(
      map((response: any) => response.data.createSpeciality)
    );
  }

  public getAllEspecialidades(page: number): Observable<{ pageInfo: PageInfo, especialidades: Especialidad[] }> {
    const query = gql`
      query GetAllSpecialities($page: Int!) {
        getAllSpecialities(
          pageRequest: { page: $page, size: 5, order: {field: "name", direction: ASC}}
        ) {
          pageInfo {
            totalItems
            currentPage
            totalPages
          }
          specialities {
            id
            code
            name
            description
          }
        }
      }`;

    return this.apollo.query<{ getAllSpecialities: { pageInfo: PageInfo, specialities: Especialidad[] } }>({
      query,
      variables: { page }
    }).pipe(
      map(response => ({
        pageInfo: response.data.getAllSpecialities.pageInfo,
        especialidades: response.data.getAllSpecialities.specialities
      }))
    );
  }

  public deleteEspecialidad(id: string): Observable<boolean> {
    const mutation = gql`
      mutation DeleteSpeciality($id: ID!) {
        deleteSpeciality(id: $id)
      }`;

    return this.apollo.mutate<{ deleteSpeciality: boolean }>({
      mutation,
      variables: { id }
    }).pipe(
      map((response: any) => response.data.deleteSpeciality)
    );
  }

  public getEspecailidadesFiltered(page: number, name: string): Observable<{ pageInfo: PageInfo, especialidades: Especialidad[] }> {
    const query = gql`
      query GetSpecialitiesFiltered($page: Int!, $name: String!) {
        getAllSpecialities(
          pageRequest: { page: $page, size: 5, order: {field: "name", direction: ASC}}
          specification: { name: $name }
        ) {
          pageInfo {
            totalItems
            currentPage
            totalPages
          }
          specialities {
            id
            code
            name
            description
          }
        }
      }`;

    return this.apollo.query<{ getAllSpecialities: { pageInfo: PageInfo, specialities: Especialidad[] } }>({
      query,
      variables: {
        page: page,
        name: name
      }
    }).pipe(
      map(response => ({
        pageInfo: response.data.getAllSpecialities.pageInfo,
        especialidades: response.data.getAllSpecialities.specialities
      }))
    );
  }

  public getEspecialidadesByNombre(nombre: string): Observable<Especialidad[]> {
    const query = gql`
      query GetEspecialidadesByNombre($nombre: String!) {
        getAllSpecialities(
          pageRequest: { page: 1, size: 10 }
          specification: { name: $nombre }
        ) {
          specialities {
            id
            code
            name
            description
          }
        }
      }`;

    return this.apollo.query<{ getAllSpecialities: { specialities: Especialidad[] } }>({
      query,
      variables: { nombre }
    }).pipe(
      map(response => response.data.getAllSpecialities.specialities)
    );
  }

  public getEspecialidadesById(id: string): Observable<Especialidad> {
    const query = gql`
      query GetSpecialityById($id: ID!) {
        getSpecialityById(id: $id) {
          id
          code
          name
          description
        }
      }`;

    return this.apollo.query<{ getSpecialityById: Especialidad }>({
      query,
      variables: {
        id
      }
    }).pipe(
      map(response => response.data.getSpecialityById)
    );
  }
}
