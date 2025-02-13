import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { MedcialSecure } from '../models/medicalSecure.model';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {

  constructor(private apollo: Apollo) { }

  getMedicalSecures(): Observable<MedcialSecure[]> {
    return this.apollo.query({
      query: gql`
        query {
          getAllMedicalSecures(pageRequest: {page: 1, size: 10}) {
            medicalSecures {
              id
              name
            }
          }
        }
      `
    }).pipe(
      map((response: any) => response.data.getAllMedicalSecures.medicalSecures)
    );
  }
}
