import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SorteoService, ClienteService, BilleteService } from '../../core/services';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalSorteos: number;
  totalClientes: number;
  totalBilletes: number;
  billetesDisponibles: number;
  billetesVendidos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: DashboardStats = {
    totalSorteos: 0,
    totalClientes: 0,
    totalBilletes: 0,
    billetesDisponibles: 0,
    billetesVendidos: 0
  };

  constructor(
    private sorteoService: SorteoService,
    private clienteService: ClienteService,
    private billeteService: BilleteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    forkJoin({
      sorteos: this.sorteoService.getSorteos(),
      clientes: this.clienteService.getClientes(),
      billetes: this.billeteService.getBilletes()
    }).subscribe({
      next: (data) => {
        this.stats.totalSorteos = data.sorteos.length;
        this.stats.totalClientes = data.clientes.length;
        this.stats.totalBilletes = data.billetes.length;
        this.stats.billetesDisponibles = data.billetes.filter(b => b.estado === 'DISPONIBLE').length;
        this.stats.billetesVendidos = data.billetes.filter(b => b.estado === 'VENDIDO').length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  navigateToVenta(): void {
    this.router.navigate(['/billetes']);
  }

  navigateToSorteos(): void {
    this.router.navigate(['/sorteos']);
  }

  navigateToClientes(): void {
    this.router.navigate(['/clientes']);
  }
}
