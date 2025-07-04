import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { EmployeeManagementComponent } from './components/employee-management/components/employee-management.component';
import { LeaveManagementComponent } from './components/leave-management/components/leave-management.component';
import { ExitManagementComponent } from './components/exit-management/components/exit-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees/add', component: AddEmployeeComponent },
  { path: 'employees', component: EmployeeManagementComponent },
  { path: 'leave-requests', component: LeaveManagementComponent },
  { path: 'exit-process', component: ExitManagementComponent },
  { path: '**', redirectTo: '/dashboard' }
];
