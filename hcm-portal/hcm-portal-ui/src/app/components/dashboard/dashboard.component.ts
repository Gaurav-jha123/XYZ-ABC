import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();
  employeeCount = 0;
  pendingLeaveRequests = 0;
  exitProcesses = 0;
  totalEmployees = 0;

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (this.authService.isManager() && currentUser) {
      this.employeeService.getEmployeesByManager(currentUser.id).subscribe(employees => {
        this.employeeCount = employees.length;
      });
      
      this.employeeService.getLeaveRequestsByManager(currentUser.id).subscribe(requests => {
        this.pendingLeaveRequests = requests.filter(req => req.status === 'Pending').length;
      });
    }
    
    if (this.authService.isAdmin()) {
      this.employeeService.getEmployees().subscribe(employees => {
        this.totalEmployees = employees.length;
      });
      
      this.employeeService.getExitRequests().subscribe(exits => {
        this.exitProcesses = exits.filter(exit => exit.status === 'In Progress').length;
      });
    }
  }
}
