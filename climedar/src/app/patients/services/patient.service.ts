import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Paciente } from '../models/paciente.models';
import { PageInfo } from '../../shared/models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private apollo: Apollo) { }

  getAllPatients(page: number): Observable<{ pageInfo: PageInfo, patients: Paciente[] }> {
    const body = `
      query {
        getAllPatients(
          pageRequest: { page: ${page}, size: 10}
        ) {
            patients {
              id
              name
              surname
              dni
            }
            pageInfo {
              totalItems
              currentPage
              totalPages
            }
          }
        }`;
    return this.apollo.query<{ getAllPatients: { patients: Paciente[], pageInfo: PageInfo } }>({ query: gql`${body}` }).pipe(
      map(response => response.data.getAllPatients)
    );
  }

  createPatient(patient: Paciente): Observable<any> {
    const body = `
        mutation {
        createPatient(
          patient: {
            name: "${patient.name}",
            surname: "${patient.surname}"
            dni: "${patient.dni}",
            gender: ${patient.gender!},
            birthdate: "${patient.birthdate}",
            email: "${patient.email}",
            phone: "${patient.phone}",
            medicalSecure: { 
              id: "${patient.medicalSecure!.id}"
              name: "${patient.medicalSecure!.name}"
            },
            address: {
              street: "${patient.address!.street}",
              number: "${patient.address!.number}",
              apartment: "${patient.address!.apartment}",
              floor: "${patient.address!.floor}"
            }
          }
        ) {
          id
          name
          surname
        }
        }
      `;
    console.log('createPatient' + body);
    return this.apollo.mutate({
      mutation: gql`${body}`
    });
  }

  getPatients(dni: string = ""): Observable<Paciente[]> {
    const GET_PATIENTS = gql`
      query {
        getAllPatients(
          pageRequest: { page: 1, size: 10}
          specification: {dni: "${dni}"}
        ) {
          patients {
              id
              name
              surname
          }
        }
      }
      `;
    return this.apollo.query<{ getAllPatients: { patients: Paciente[] } }>({
      query: GET_PATIENTS
    }).pipe(
      map(response => response.data.getAllPatients.patients)
    );
  }

  deletePatient(id: number): Observable<any> {
    const body = `
        mutation {
        deletePatient(id: ${id})
        }
      `;
    return this.apollo.mutate({
      mutation: gql`${body}`
    });
  }

  getPatientById(id: string): Observable<Paciente> {
    const body = `
      query {
        getPatientById(id: ${id}) {
          birthdate
          dni
          email
          gender
          id
          medicalSecure {
            name
            id
          }
          name
          phone
          surname
          address {
            apartment
            floor
            number
            street
          }
    }
  }`;
    return this.apollo.query<{ getPatientById: Paciente }>({ query: gql`${body}` }).pipe(
      map(response => response.data.getPatientById)
    );
  }

  updatePatient(patient: Paciente): Observable<any> {
    const body = `
        mutation {
          updatePatient(
            id: ${patient.id},
            patient: {
              name: "${patient.name}",
              surname: "${patient.surname}"
              dni: "${patient.dni}",
              gender: ${patient.gender!},
              birthdate: "${patient.birthdate}",
              email: "${patient.email}",
              phone: "${patient.phone}",
              medicalSecure: { 
                id: "${patient.medicalSecure!.id}"
              },
              address: {
                street: "${patient.address!.street}",
                number: "${patient.address!.number}",
                apartment: "${patient.address!.apartment}",
                floor: "${patient.address!.floor}"
              }
            }
          ) {
            birthdate
            dni
            email
            gender
            id
            medicalSecure {
              name
              id
            }
            name
            phone
            surname
            address {
              apartment
              floor
              number
              street
            }
          }
        }
      `;
    console.log('modify patient' + body);
    return this.apollo.mutate({
      mutation: gql`${body}`
    });
  }

  getPacientes(page:number, query: string): Observable<{ pageInfo: PageInfo, patients: Paciente[] }>{
    const QUERY = gql`
        query GetAllPatients($dni: String, $fullName: String) {
            getAllPatients(
                pageRequest: { page: ${page}, size: 10 , order: {field: "name", direction: ASC}},
                specification: {
                    dni: $dni,
                    fullName: $fullName
                }
            ) {
                pageInfo {
                  currentPage
                  totalItems
                  totalPages
                }
                patients {
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
                  id
                  medicalSecure {
                    id
                    name
                  }
                  name
                  phone
                  surname
                }
            }
        }
    `;

    const variables = /^\d+$/.test(query)
      ? { dni: query, fullName: "" }
      : { dni: "", fullName: query };

    return this.apollo.query<{ getAllPatients: { patients: Paciente[], pageInfo: PageInfo } }>({
      query: QUERY,
      variables: variables
    }).pipe(
      map(response => response.data.getAllPatients)
    );
  }

}
