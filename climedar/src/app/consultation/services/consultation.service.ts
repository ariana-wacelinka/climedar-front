import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Consultation, CreateConsultation } from '../models/consultation.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private apollo: Apollo) { }

  createConsultation(consultation: CreateConsultation): Observable<Consultation> {
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

  getConsultationPrice(servicesIds: string[] = [], patientId: string = ""): Observable<number> {
    const GET_CONSULTATION_PRICE_QUERY = `
      query {
        getConsultationPrice(servicesIds: [${servicesIds}], patientId: "${patientId}")
      }
    `;
    console.log(GET_CONSULTATION_PRICE_QUERY);
    return this.apollo.query({
      query: gql(GET_CONSULTATION_PRICE_QUERY),
    }).pipe(map((result: any) => {
      console.log(result);
      return result.data.getConsultationPrice}));
  }
}
