export enum EstadoBillete {
  DISPONIBLE = 'DISPONIBLE',
  VENDIDO = 'VENDIDO'
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors: string[];
  path: string;
}
