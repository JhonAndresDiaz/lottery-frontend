import { EstadoBillete } from './common.model';

export interface BilleteResponse {
  id: number;
  numero: string;
  precio: number;
  estado: EstadoBillete;
  sorteoId: number;
  sorteoNombre: string;
  clienteId?: number;
  clienteNombre?: string;
  clienteEmail?: string;
  fechaVenta?: string;
  fechaCreacion: string;
}

export interface CreateBilleteRequest {
  numero: string;
  precio: number;
  sorteoId: number;
}

export interface VentaBilleteRequest {
  billeteId: number;
  clienteId: number;
}
