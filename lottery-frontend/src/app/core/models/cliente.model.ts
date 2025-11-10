export interface ClienteResponse {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro: string;
  totalBilletesComprados: number;
}

export interface CreateClienteRequest {
  nombre: string;
  email: string;
}
