export interface SorteoResponse {
  id: number;
  nombre: string;
  fecha: string;
  fechaCreacion: string;
  totalBilletes: number;
  billetesDisponibles: number;
  billetesVendidos: number;
}

export interface CreateSorteoRequest {
  nombre: string;
  fecha: string;
}
