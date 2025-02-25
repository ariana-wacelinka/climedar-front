import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.models';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { PageInfo } from '../../shared/models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private apollo: Apollo) { }

  public getDoctorsByName(name: string, specialityid: string = ""): Observable<Doctor[]> {
    console.log('getDoctorsByName');
    console.log('name: ', name);
    const query = gql`
      query {
        getAllDoctors(pageRequest: {page: 1, size: 10, order: {field: "name", direction: ASC}}, specification: {fullName: "${name}", specialityId: "${specialityid}" }) {
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
      }
    `;
    console.log('query: ', query);

    return this.apollo.watchQuery<{ getAllDoctors: { doctors: Doctor[] } }>({
      query: query
    }).valueChanges.pipe(
      map(result => result.data.getAllDoctors.doctors)
    );
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    const body = `
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
            id: "${doctor.speciality?.id}"
          },
          address: {
            street: "${doctor.address?.street}",
            number: "${doctor.address?.number}",
            apartment: "${doctor.address?.apartment}",
            floor: "${doctor.address?.floor}"
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
    return this.apollo.mutate<{ createDoctor: Doctor }>({
      mutation: gql`${body}`
    }).pipe(
      map(result => result.data!.createDoctor)
    );
  }

  getAllDoctors(page: number): Observable<{ doctors: Doctor[], pageInfo: PageInfo }> {
    const query = gql`
      query {
        getAllDoctors(pageRequest: {page: ${page}, size: 15, order: {field: "name", direction: ASC}}) {
          doctors {
            dni
            email
            id
            name
            surname
          }
          pageInfo {
            totalPages
            totalItems
            currentPage
          }
        }
      }`;
    return this.apollo.watchQuery<{ getAllDoctors: { doctors: Doctor[], pageInfo: PageInfo } }>({ query: query }).valueChanges.pipe(
      map(result => result.data.getAllDoctors)
    );
  }

  deleteDoctor(id: number): Observable<boolean> {
    const body = `
      mutation {
        deleteDoctor(id: ${id})
      }
    `;
    return this.apollo.mutate<{ deleteDoctor: boolean }>({
      mutation: gql`${body}`
    }).pipe(
      map(result => result.data!.deleteDoctor)
    );
  }

  getDoctorById(id: string): Observable<Doctor> {
    const query = gql`
      query {
        getDoctorById(id: ${id}) {
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
            address{
              street
              number
              apartment
              floor
            }
          }
        }`;
    return this.apollo.watchQuery<{ getDoctorById: Doctor }>({ query: query }).valueChanges.pipe(
      map(result => result.data.getDoctorById)
    );
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    const body = `
    mutation MyMutation {
      updateDoctor(
        doctor: {address: {number: "${doctor.address?.number}",
        apartment: "${doctor.address?.apartment}", 
        floor: "${doctor.address?.floor}", 
        street: "${doctor.address?.street}"}, 
        birthDate: "${doctor.birthdate}", 
        dni: "${doctor.dni}", 
        gender: ${doctor.gender}, 
        email: "${doctor.email}", 
        name: "${doctor.name}", 
        phone: "${doctor.phone}", 
        salary: ${doctor.salary},
        speciality: {
            id: "${doctor.speciality?.id}"
          },
        surname: "${doctor.surname}"}
        id: "${doctor.id}"
          ) {
            address {
              apartment
              floor
              number
              street
            }
            birthdate
            dni
            email
            gender
            name
            id
            phone
            salary
            surname
          }
        }`;
    console.log('updateDoctor' + body);
    return this.apollo.mutate<{ updateDoctor: Doctor }>({
      mutation: gql`${body}`
    }).pipe(
      map(result => result.data!.updateDoctor)
    );
  }

  getDoctorsFiltro(page: number, query: string): Observable<{ pageInfo: PageInfo, doctors: Doctor[] }> {
    const QUERY = gql`
          query GetAllDoctors($dni: String, $fullName: String) {
              getAllDoctors(
                  pageRequest: { page: ${page}, size: 15, order: {field: "name", direction: ASC}},
                  specification: {
                      dni: $dni,
                      fullName: $fullName
                  }
              ) {
                  doctors {
                    dni
                    email
                    id
                    name
                    surname
                  }
                  pageInfo {
                    totalPages
                    totalItems
                    currentPage
                  }
                }
              }`
    const variables = /^\d+$/.test(query)
      ? { dni: query, fullName: "" }
      : { dni: "", fullName: query };

    return this.apollo.query<{ getAllDoctors: { doctors: Doctor[], pageInfo: PageInfo } }>({
      query: QUERY,
      variables: variables
    }).pipe(
      map(response => response.data.getAllDoctors)
    );
  }
}
