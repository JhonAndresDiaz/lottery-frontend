import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClienteService, BilleteService } from '../../core/services';
import { ClienteResponse, BilleteResponse } from '../../core/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  loading = true;
  clientes: ClienteResponse[] = [];
  displayedColumns: string[] = [
    'nombre', 
    'email', 
    'fechaRegistro', 
    'totalBilletesComprados',
    'acciones'
  ];

  // Formulario
  showForm = false;
  clienteForm: FormGroup;
  submitting = false;

  // Historial
  showHistorial = false;
  historialCliente: ClienteResponse | null = null;
  historialBilletes: BilleteResponse[] = [];
  loadingHistorial = false;

  constructor(
    private clienteService: ClienteService,
    private billeteService: BilleteService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los clientes', 'Error');
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.clienteForm.reset();
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.toastr.warning('Por favor complete todos los campos correctamente', 'Formulario inválido');
      return;
    }

    this.submitting = true;
    const request = this.clienteForm.value;

    this.clienteService.createCliente(request).subscribe({
      next: (response) => {
        this.toastr.success(`Cliente "${response.nombre}" registrado exitosamente`, '¡Éxito!');
        this.loadClientes();
        this.toggleForm();
        this.submitting = false;
      },
      error: (error) => {
        const mensaje = error.error?.message || 'Error al registrar el cliente';
        this.toastr.error(mensaje, 'Error');
        this.submitting = false;
      }
    });
  }

  verHistorial(cliente: ClienteResponse): void {
    this.showHistorial = true;
    this.historialCliente = cliente;
    this.loadingHistorial = true;

    this.billeteService.getHistorialCliente(cliente.id).subscribe({
      next: (billetes) => {
        this.historialBilletes = billetes;
        this.loadingHistorial = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar el historial', 'Error');
        this.loadingHistorial = false;
      }
    });
  }

  cerrarHistorial(): void {
    this.showHistorial = false;
    this.historialCliente = null;
    this.historialBilletes = [];
  }
}
