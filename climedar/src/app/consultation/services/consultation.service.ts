import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateConsultation } from '../models/consultation.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private apollo: Apollo) { }

  createConsultation(consultation: CreateConsultation): Observable<CreateConsultation> {
    const CREATE_CONSULTATION_MUTATION = gql`
      mutation CreateConsultation($consultation: ConsultationInput!) {
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
          shiftId: consultation.shiftId || null,
          doctorId: consultation.doctorId || null,
        }
      }
    }).pipe(map((result: any) => result.data.createConsultation));
  }
}
