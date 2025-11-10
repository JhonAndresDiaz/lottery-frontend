import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BilleteResponse, CreateBilleteRequest, VentaBilleteRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BilleteService {
  private readonly apiUrl = `${environment.apiUrl}/billetes`;

  constructor(private http: HttpClient) {}

  getBilletes(): Observable<BilleteResponse[]> {
    return this.http.get<BilleteResponse[]>(this.apiUrl);
  }

  getBilleteById(id: number): Observable<BilleteResponse> {
    return this.http.get<BilleteResponse>(`${this.apiUrl}/${id}`);
  }

  getBilletesBySorteo(sorteoId: number): Observable<BilleteResponse[]> {
    return this.http.get<BilleteResponse[]>(`${this.apiUrl}/sorteo/${sorteoId}`);
  }

  getBilletesDisponibles(sorteoId: number): Observable<BilleteResponse[]> {
    return this.http.get<BilleteResponse[]>(`${this.apiUrl}/sorteo/${sorteoId}/disponibles`);
  }

  getHistorialCliente(clienteId: number): Observable<BilleteResponse[]> {
    return this.http.get<BilleteResponse[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  createBillete(request: CreateBilleteRequest): Observable<BilleteResponse> {
    return this.http.post<BilleteResponse>(this.apiUrl, request);
  }

  // ⭐ ENDPOINT PRINCIPAL - VENDER BILLETE
  venderBillete(request: VentaBilleteRequest): Observable<BilleteResponse> {
    return this.http.post<BilleteResponse>(`${this.apiUrl}/vender`, request);
  }
}
