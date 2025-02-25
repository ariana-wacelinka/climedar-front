import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Consultation, ConsultationResponse, CreateConsultation } from '../models/consultation.model';
import { map, Observable } from 'rxjs';
import { PageInfo } from '../../shared/models/extras.models';

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
      return result.data.getConsultationPrice
    }));
  }

  getConsultasByDoctorId(page: number, doctorId: string): Observable<{ consultations: ConsultationResponse[], pageInfo: PageInfo }> {
    const query = gql`
      query GetAllConsultations {
        getAllConsultations(
          pageRequest: {page: ${page}, size: 5}
          specification: {doctorId: "${doctorId}"}
        ) {
          consultations{
            id
            startTime
            endTime
            description
            date
            isPaid
            finalPrice
            observation
            patient {
              id
              name
              surname
            }
            medicalServicesModel {
              id
              estimatedDuration
              price
            }
            shift {
              id
            }
          }
          pageInfo {
              totalPages
              totalItems
              currentPage
          }
        }
      }`
    return this.apollo.query<{ getAllConsultations: { consultations: ConsultationResponse[], pageInfo: PageInfo } }>({
      query
    }).pipe(
      map(response => response.data.getAllConsultations)
    );
  }

  getConsultasByPatientId(page: number, patientId: string): Observable<{ consultations: ConsultationResponse[], pageInfo: PageInfo }> {
    const query = gql`
      query GetAllConsultations {
        getAllConsultations(
          pageRequest: {page: ${page}, size: 5}
          specification: {patientId: "${patientId}"}
        ) {
          consultations{
            id
            startTime
            endTime
            description
            date
            isPaid
            finalPrice
            observation
            doctor {
              id
              name
              surname
            }
            medicalServicesModel {
              id
              estimatedDuration
              price
            }
            shift {
              id
            }
          }
          pageInfo {
              totalPages
              totalItems
              currentPage
          }
        }
      }`
    return this.apollo.query<{ getAllConsultations: { consultations: ConsultationResponse[], pageInfo: PageInfo } }>({
      query
    }).pipe(
      map(response => response.data.getAllConsultations)
    );
  }

  getAllConsultations(page: number): Observable<{ consultations: ConsultationResponse[], pageInfo: PageInfo }> {
    const query = gql`
      query GetAllConsultations {
        getAllConsultations(
          pageRequest: {page: ${page}, size: 5}
        ) {
          consultations{
            id
            startTime
            endTime
            description
            date
            isPaid
            finalPrice
            observation
            patient {
              id
              name
              surname
            }
            medicalServicesModel {
              id
              estimatedDuration
              price
            }
            shift {
              id
            }
          }
          pageInfo {
              totalPages
              totalItems
              currentPage
          }
        }
      }`
    return this.apollo.query<{ getAllConsultations: { consultations: ConsultationResponse[], pageInfo: PageInfo } }>({
      query
    }).pipe(
      map(response => response.data.getAllConsultations)
    );
  }

  getConsultationById(id: number): Observable<ConsultationResponse> {
    const query = gql`
      query GetConsultationById {
        getConsultationById(id: ${id}) {
          id
          startTime
          endTime
          description
          date
          isPaid
          finalPrice
          observation
          patient {
            id
            name
            surname
          }
          doctor {
            id
            name
            surname
          }
          medicalServicesModel {
            id
            estimatedDuration
            price
          }
          shift {
            id
          }
        }
      }`
    return this.apollo.query<{ getConsultationById: ConsultationResponse }>({
      query
    }).pipe(
      map(response => response.data.getConsultationById)
    );
  }

  updateConsultation(id: string, consultation: CreateConsultation): Observable<ConsultationResponse> {
    console.log("updateConsultation", id);
    const ids = consultation.medicalServicesId.map(id => `"${id}"`).join(',');

    const UPDATE_CONSULTATION_MUTATION = `
      mutation UpdateConsultation {
        updateConsultation(id: "${id}", consultation: {
          description: "${consultation.description}",
          medicalServicesId: [${ids}],
          observation: "${consultation.observation}",
          patientId: "${consultation.patientId}"
        }) {
          id
          finalPrice
        }
      }
    `;
    console.log(UPDATE_CONSULTATION_MUTATION);
    return this.apollo.mutate({
      mutation: gql`${UPDATE_CONSULTATION_MUTATION}`
    }).pipe(map((result: any) => result.data.updateConsultation));
  }
}
