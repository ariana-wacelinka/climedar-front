import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.models';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  apiurl = 'http://localhost:8083/graphql';
  constructor(private http: HttpClient, private apollo: Apollo) { }

  public getDoctorsByName(name: string, specialityid: string) {
    console.log('getDoctorsByName');
    console.log('name: ', name);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    var body = {
      query: `{
            getAllDoctors(pageRequest: {page: 1, size: 10}, specification: {fullName: "${name}", specialityId: "${specialityid}" }) {
    doctors {
      birthdate
      dni
      email
      gender
      id
      name
      phone
      salary
      surname
      speciality {
        code
        description
        id
        name
      }
    }
    }
}`,
    }
    console.log('query: ', body);

    return this.http.post<{ data: { getAllDoctors: { doctors: Doctor[] } } }>(
      this.apiurl,
      body,
      { headers }
    ).pipe(
      // Extrae solo la lista de doctores de la respuesta
      map(response => response.data.getAllDoctors.doctors)
    );
  }

  createDoctor(doctor: any): Observable<any> {
    const body =  `
      mutation {
      createDoctor(
        doctor: {
          name: "${doctor.name}",
          surname: "${doctor.surname}"
          dni: "${doctor.dni}",
          gender: ${doctor.gender!},
          birthdate: "${doctor.birthdate}",
          salary: ${doctor.salary},
          email: "${doctor.email}",
          phone: "${doctor.phone}",
          speciality: { 
            id: "${doctor.speciality.id}"
          },
          address: {
            street: "${doctor.address.street}",
            number: "${doctor.address.number}",
            apartment: "${doctor.address.apartment}",
            floor: "${doctor.address.floor}"
          }
    }
      ) {
        id
        name
        surname
      }
      }
    `;
    console.log('createDoctor' + body);
    return this.apollo.mutate({
      mutation: gql`${body}`
    });
  }
}
