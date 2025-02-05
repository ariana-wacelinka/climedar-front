import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Turno } from '../../models/turno.models';
import { Especialidad } from '../../../especialidad';
import { Doctor } from '../../../doctors/models/doctor.models';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private http: HttpClient) { }

  public getTurnosByDate(date: string, doctor: Doctor, startTime: string, endTime: string, page: number): Observable<Turno[]> {
    const apiUrl = 'http://localhost:8083/graphql';
    console.log('getTurnosByDate');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: `{
                getAllShifts(
                  pageRequest: {page: 1, size: 10},
                  specification: { date: "${date}", doctorId: "${doctor.id}" }
                ) {
                      pageInfo {
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
                          }
                      }
                  }
                
              }`
    }
    console.log('query: ', body);
    return this.http.post<{ data: { getAllShifts: { shifts: Turno[] } } }>(
      apiUrl,
      body,
      { headers }
    ).pipe(
      // Extrae solo la lista de turnos de la respuesta
      map(response => response.data.getAllShifts.shifts)
    );
  }
}
