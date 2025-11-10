import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { SorteoService, ClienteService, BilleteService } from '../../core/services';
import { 
  SorteoResponse, 
  ClienteResponse, 
  BilleteResponse, 
  EstadoBillete 
} from '../../core/models';

@Component({
  selector: 'app-billetes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule
  ],
  templateUrl: './billetes.component.html',
  styleUrl: './billetes.component.scss'
})
export class BilletesComponent implements OnInit {
  // Estado general
  loading = false;
  sorteos: SorteoResponse[] = [];
  clientes: ClienteResponse[] = [];
  billetesDisponibles: BilleteResponse[] = [];
  
  // Venta
  sorteoSeleccionado: number | null = null;
  billeteSeleccionado: BilleteResponse | null = null;
  clienteSeleccionado: number | null = null;

  // Crear billete
  showFormCrear = false;
  billeteForm: FormGroup;
  submitting = false;

  // Enums para template
  EstadoBillete = EstadoBillete;

  constructor(
    private sorteoService: SorteoService,
    private clienteService: ClienteService,
    private billeteService: BilleteService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.billeteForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      precio: ['', [Validators.required, Validators.min(1)]],
      sorteoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;
    
    this.sorteoService.getSorteos().subscribe({
      next: (sorteos) => {
        this.sorteos = sorteos;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar sorteos', 'Error');
        this.loading = false;
      }
    });

    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        this.toastr.error('Error al cargar clientes', 'Error');
      }
    });
  }

  onSorteoChange(): void {
    if (!this.sorteoSeleccionado) {
      this.billetesDisponibles = [];
      this.billeteSeleccionado = null;
      return;
    }

    this.loading = true;
    this.billeteSeleccionado = null;

    this.billeteService.getBilletesDisponibles(this.sorteoSeleccionado).subscribe({
      next: (billetes) => {
        this.billetesDisponibles = billetes;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar billetes', 'Error');
        this.loading = false;
      }
    });
  }

  seleccionarBillete(billete: BilleteResponse): void {
    this.billeteSeleccionado = billete;
  }

  confirmarVenta(): void {
    if (!this.billeteSeleccionado || !this.clienteSeleccionado) {
      this.toastr.warning('Debe seleccionar un billete y un cliente', 'Advertencia');
      return;
    }

    this.loading = true;

    this.billeteService.venderBillete({
      billeteId: this.billeteSeleccionado.id,
      clienteId: this.clienteSeleccionado
    }).subscribe({
      next: (response) => {
        this.toastr.success(
          `Billete #${response.numero} vendido exitosamente a ${response.clienteNombre}`,
          '¡Venta exitosa!'
        );
        this.resetearSeleccion();
        this.onSorteoChange();
        this.loading = false;
      },
      error: (error) => {
        const mensaje = error.error?.message || 'Error al realizar la venta';
        this.toastr.error(mensaje, 'Error en la venta');
        this.loading = false;
      }
    });
  }

  resetearSeleccion(): void {
    this.billeteSeleccionado = null;
    this.clienteSeleccionado = null;
  }

  cancelarVenta(): void {
    this.resetearSeleccion();
  }

  // Crear billete
  toggleFormCrear(): void {
    this.showFormCrear = !this.showFormCrear;
    if (!this.showFormCrear) {
      this.billeteForm.reset();
    }
  }

  onSubmitCrear(): void {
    if (this.billeteForm.invalid) {
      this.toastr.warning('Por favor complete todos los campos correctamente', 'Formulario inválido');
      return;
    }

    this.submitting = true;
    const request = this.billeteForm.value;

    this.billeteService.createBillete(request).subscribe({
      next: (response) => {
        this.toastr.success(`Billete #${response.numero} creado exitosamente`, '¡Éxito!');
        this.toggleFormCrear();
        this.submitting = false;
        
        // Si el sorteo seleccionado es el mismo, recargar billetes
        if (this.sorteoSeleccionado === response.sorteoId) {
          this.onSorteoChange();
        }
      },
      error: (error) => {
        const mensaje = error.error?.message || 'Error al crear el billete';
        this.toastr.error(mensaje, 'Error');
        this.submitting = false;
      }
    });
  }

  get nombreClienteSeleccionado(): string {
    const c = this.clientes?.find(x => x.id === this.clienteSeleccionado);
    return c ? c.nombre : '';
  }
}
