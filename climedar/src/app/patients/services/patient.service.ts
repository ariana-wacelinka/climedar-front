import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private apollo: Apollo) {}

  
  createPatient(patient: Paciente): Observable<any> {
      const body =  `
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
}
