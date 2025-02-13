import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Especialidad } from '../models';
import { map, Observable } from 'rxjs';
import { PageInfo } from '../../shared/models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  apiUrl = 'http://localhost:8083/graphql';
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })

  constructor(private http: HttpClient) { }

  public updateEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      query: `mutation {
      updateSpeciality(id: "${especialidad.id}", speciality: {
        code: "${especialidad.code}", 
        description: "${especialidad.description}", 
        name: "${especialidad.name}"
      }) {
        id
        code
        name
        description
      }
    }`
    };
  
    return this.http.post<{ data: { updateSpeciality: Especialidad } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => response.data.updateSpeciality)
    );
  }

  public createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      query: `
        mutation CreateSpeciality($code: String!, $description: String!, $name: String!) {
          createSpeciality(speciality: {code: $code, description: $description, name: $name}) {
            id
            code
            name
            description
          }
        }`,
      variables: {
        code: especialidad.code,
        description: especialidad.description,
        name: especialidad.name
      }
    };
  
    return this.http.post<{ data: { createSpeciality: Especialidad } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => response.data.createSpeciality)
    );
  }  

  public getAllEspecialidades(page: number): Observable<{ pageInfo: PageInfo, especialidades: Especialidad[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      query: `{
        getAllSpecialities(
          pageRequest: { page: ${page}, size: 5, order: {field: "name", direction: ASC}}
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
      }`
    };
  
    return this.http.post<{ data: { getAllSpecialities: { pageInfo: PageInfo, specialities: Especialidad[] } } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => ({
        pageInfo: response.data.getAllSpecialities.pageInfo,
        especialidades: response.data.getAllSpecialities.specialities
      }))
    );
  }  

  public deleteEspecialidad(id: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      query: `mutation {
        deleteSpeciality(id: "${id}")
      }`
    };
  
    return this.http.post<{ data: { deleteSpeciality: boolean } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => response.data.deleteSpeciality) // Devuelve el resultado como booleano
    );
  }

  
  public getEspecialidadesByNombre(nombre: string): Observable<Especialidad[]> {
    console.log('getEspecialidadesByNombre');
    console.log('nombre: ', nombre);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    var body = {
      query:`{
                    getAllSpecialities(
                      pageRequest: {page: 1, size: 10}
                      specification: {name: "${nombre}"}
                  ) {
                      specialities {
                          id
                          code
                          name
                          description
                      }
                  }
                  }`,
    };
    console.log('query: ', body);
    return this.http.post<{ data: { getAllSpecialities: { specialities: Especialidad[] } } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      // Extrae solo la lista de especialidades de la respuesta
      map(response => response.data.getAllSpecialities.specialities)
    );
  }

  public getEspecialidadesById(id: number): Observable<Especialidad> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      query: `{
        getSpecialityById(id: ${id}) {
          id
          code
          name
          description
        }
      }`
    };
  
    return this.http.post<{ data: { getSpecialityById: Especialidad } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => response.data.getSpecialityById)
    );
  }
}
