import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { SorteoService } from '../../core/services';
import { SorteoResponse } from '../../core/models';

@Component({
  selector: 'app-sorteos',
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
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './sorteos.component.html',
  styleUrl: './sorteos.component.scss'
})
export class SorteosComponent implements OnInit {
  loading = true;
  sorteos: SorteoResponse[] = [];
  displayedColumns: string[] = [
    'nombre', 
    'fecha', 
    'totalBilletes', 
    'billetesDisponibles', 
    'billetesVendidos', 
    'estado'
  ];
  
  // Formulario
  showForm = false;
  sorteoForm: FormGroup;
  submitting = false;

  constructor(
    private sorteoService: SorteoService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.sorteoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSorteos();
  }

  loadSorteos(): void {
    this.loading = true;
    
    this.sorteoService.getSorteos().subscribe({
      next: (sorteos) => {
        this.sorteos = sorteos;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los sorteos', 'Error');
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.sorteoForm.reset();
    }
  }

  onSubmit(): void {
    if (this.sorteoForm.invalid) {
      this.toastr.warning('Por favor complete todos los campos correctamente', 'Formulario inválido');
      return;
    }

    this.submitting = true;
    const formValue = this.sorteoForm.value;
    
    // Formatear fecha a yyyy-MM-dd
    const fecha = new Date(formValue.fecha);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    const request = {
      nombre: formValue.nombre,
      fecha: fechaFormateada
    };

    this.sorteoService.createSorteo(request).subscribe({
      next: (response) => {
        this.toastr.success(`Sorteo "${response.nombre}" creado exitosamente`, '¡Éxito!');
        this.loadSorteos();
        this.toggleForm();
        this.submitting = false;
      },
      error: (error) => {
        const mensaje = error.error?.message || 'Error al crear el sorteo';
        this.toastr.error(mensaje, 'Error');
        this.submitting = false;
      }
    });
  }

  getEstadoSorteo(sorteo: SorteoResponse): string {
    if (sorteo.billetesDisponibles === 0) return 'agotado';
    if (sorteo.billetesDisponibles < sorteo.totalBilletes * 0.3) return 'pocos';
    return 'disponible';
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      'agotado': 'Agotado',
      'pocos': 'Últimos billetes',
      'disponible': 'Disponible'
    };
    return labels[estado] || 'Desconocido';
  }
}
