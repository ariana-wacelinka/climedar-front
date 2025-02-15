import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Turno } from '../../models/turno.models';
import { PageInfo } from '../../../shared/models/extras.models';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private http: HttpClient, private apollo: Apollo) { }

  public getDaysWithShiftsByMonth(date: Date, doctorId: string): Observable<Date[]> {
    const initialDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const GET_DATES_WITH_SHIFTS = gql`
      query getDatesWithShifts($doctorId: String!, $fromDate: String!, $toDate: String!) {
        getDatesWithShifts(doctorId: $doctorId, fromDate: $fromDate, toDate: $toDate)
      }
    `;

    return this.apollo.query<{ getDatesWithShifts: string[] }>({
      query: GET_DATES_WITH_SHIFTS,
      variables: {
        doctorId,
        fromDate: initialDate,
        toDate: finalDate
      }
    }).pipe(
      map(response => response.data.getDatesWithShifts.map(date => new Date(date)))
    );
  }

  public getTurnosByDate(date: string = "", doctorId: string = "", startTime: string = "", endTime: string = "", page: number = 1): Observable<{ pageInfo: PageInfo, shifts: Turno[] }> {
    const GET_ALL_SHIFTS = gql`
      query getAllShifts($date: String!, $doctorId: ID!, $startTime: String!, $endTime: String!, $page: Int!) {
        getAllShifts(
          pageRequest: { page: $page, size: 10, order: { field: "startTime", direction: ASC } },
          specification: { date: $date, doctorId: $doctorId, fromTime: $startTime, toTime: $endTime }
        ) {
          pageInfo {
            totalItems
            currentPage
            totalPages
          }
          shifts {
            id
            date
            startTime
            endTime
            state
            timeOfShifts
            place
            doctor {
              id
              name
              surname
              gender
            }
          }
        }
      }
    `;

    return this.apollo.query<{ getAllShifts: { pageInfo: PageInfo, shifts: Turno[] } }>({
      query: GET_ALL_SHIFTS,
      variables: {
        date,
        doctorId,
        startTime,
        endTime,
        page
      }
    }).pipe(
      map(response => response.data.getAllShifts)
    );
  }

  cancelShift(shiftId: string): Observable<Turno> {
    const CANCEL_SHIFT = gql`
      mutation cancelShift($shiftId: String!) {
        cancelShift(id: $shiftId) {
          state
        }
      }
    `;

    return this.apollo.mutate<{ cancelShift: Turno }>({
      mutation: CANCEL_SHIFT,
      variables: {
        shiftId
      }
    }).pipe(
      map((response: any) => response.data.cancelShift)
    );
  }

  deleteShift(shiftId: string): Observable<boolean> {
    const DELETE_SHIFT = gql`
      mutation deleteShift($shiftId: String!) {
        deleteShift(id: $shiftId)
      }
    `;

    return this.apollo.mutate<{ deleteShift: boolean }>({
      mutation: DELETE_SHIFT,
      variables: {
        shiftId
      }
    }).pipe(
      map((response: any) => response.data.deleteShift)
    );
  }

  getShiftById(shiftId: string): Observable<Turno> {
    const GET_SHIFT_BY_ID = gql`
      query {
        getShiftById(id: ${shiftId}) {
          date
          startTime
          endTime
          timeOfShifts
          doctor {
            id
            name
            surname
            gender
            speciality {
              id
              name
            }
          }
        }
      }
    `;

    return this.apollo.query<{ getShiftById: Turno }>({
      query: GET_SHIFT_BY_ID,
    }).pipe(
      map(response => response.data.getShiftById)
    );
  }
}
