import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Turno } from '../../models/turno.models';
import { Especialidad } from '../../../especialidad';
import { Doctor } from '../../../doctors/models/doctor.models';
import { PageInfo } from '../../../shared/models/extras.models';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private http: HttpClient) { }

  public getDaysWithShiftsByMonth(date: Date, doctorId: string): Observable<Date[]> {
    const initialDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    const apiUrl = 'http://localhost:8083/graphql';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      query: `{
                getDatesWithShifts(
                  doctorId: "${doctorId}",
                  fromDate: "${initialDate}",
                  toDate: "${finalDate}"
                )
              }`
    }
    return this.http.post<{ data: { getDatesWithShifts: string[] } }>(
      apiUrl,
      body,
      { headers }
    ).pipe(
      // Extrae solo la lista de fechas de la respuesta
      map(response => response.data.getDatesWithShifts.map(date => new Date(date)))
    );
  }

  public getTurnosByDate(date: string, doctorId: string, startTime: string, endTime: string, page: number): Observable<{ pageInfo: PageInfo, shifts: Turno[] }> {
    const apiUrl = 'http://localhost:8083/graphql';
    console.log('getTurnosByDate');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: `{
                getAllShifts(
                  pageRequest: {page: ${page}, size: 10, order: { field: "startTime", direction: ASC}},
                  specification: { date: "${date}", doctorId: "${doctorId}" fromTime: "${startTime}", toTime: "${endTime}"}
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
                
              }`
    }
    console.log('query: ', body);
    return this.http.post<{ data: { getAllShifts: { pageInfo: PageInfo, shifts: Turno[] } } }>(
      apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => {
        console.log('Response:', response);
        return response.data.getAllShifts})
    );
  }

  cancelShift(shiftId: string): Observable<Turno> {
    const apiUrl = 'http://localhost:8083/graphql';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: `mutation {
                cancelShift(id: "${shiftId}") {
                    state
                }
              }`
    }
    return this.http.post<{ data: { cancelShift: Turno } }>(
      apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => {
      console.log('Response:', response);
      return response.data.cancelShift;
      })
    );
  }

  deleteShift(shiftId: string): Observable<boolean> {
    const apiUrl = 'http://localhost:8083/graphql';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: `mutation {
                deleteShift(id: "${shiftId}")
              }`
    }
    return this.http.post<{ data: { deleteShift: boolean } }>(
      apiUrl,
      body,
      { headers }
    ).pipe(
      map(response => {
      console.log('Response:', response);
      return response.data.deleteShift;
      })
    );
  }
}
