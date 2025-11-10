import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SorteosComponent } from './features/sorteos/sorteos.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { BilletesComponent } from './features/billetes/billetes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sorteos', component: SorteosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'billetes', component: BilletesComponent },
  { path: '**', redirectTo: '/dashboard' }
];
