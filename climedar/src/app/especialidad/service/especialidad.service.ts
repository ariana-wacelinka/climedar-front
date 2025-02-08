import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Especialidad } from '../models';
import { map, Observable } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  apiUrl = 'http://localhost:8083/graphql';

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
  

  public getAllEspecialidades(): Observable<Especialidad[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `
        query {
          getAllSpecialities(pageRequest: { page: 1, size: 5 }) {
            specialities {
              id
              code
              name
              description
            }
          }
        }`
    };

    return this.http.post<{ data: { getAllSpecialities: { specialities: Especialidad[] } } }>(
      this.apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => response.data?.getAllSpecialities?.specialities ?? []));
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


}
