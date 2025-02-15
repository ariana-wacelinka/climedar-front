import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateConsultation } from '../models/consultation.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private apollo: Apollo) { }

  createConsultation(consultation: CreateConsultation) {
    const CREATE_CONSULTATION_MUTATION = gql`
      mutation CreateConsultation($consultation: CreateConsultationInput!) {
        createConsultation(consultation: $consultation) {
          id
          finalPrice
        }
      }
    `;
    return this.apollo.mutate({
      mutation: CREATE_CONSULTATION_MUTATION,
      variables: {
        consultation: {
          description: consultation.description,
          medicalServicesId: consultation.medicalServicesId,
          observation: consultation.observation,
          patientId: consultation.patientId,
          shiftId: consultation.shiftId
        }
      }
    }).pipe(map((result: any) => result.data.createConsultation)).subscribe(result => {
      console.log('Created consultation: ', result);
    });
  }
}
