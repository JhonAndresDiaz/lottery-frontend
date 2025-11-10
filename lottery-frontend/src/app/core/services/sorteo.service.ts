import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SorteoResponse, CreateSorteoRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {
  private readonly apiUrl = `${environment.apiUrl}/sorteos`;

  constructor(private http: HttpClient) {}

  getSorteos(): Observable<SorteoResponse[]> {
    return this.http.get<SorteoResponse[]>(this.apiUrl);
  }

  getSorteoById(id: number): Observable<SorteoResponse> {
    return this.http.get<SorteoResponse>(`${this.apiUrl}/${id}`);
  }

  createSorteo(request: CreateSorteoRequest): Observable<SorteoResponse> {
    return this.http.post<SorteoResponse>(this.apiUrl, request);
  }
}
