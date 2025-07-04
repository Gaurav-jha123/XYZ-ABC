import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { ExitRequest, Employee } from '../../../models/employee.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InitiateExitDialogComponent } from '../dialogs/initiate-exit-dialog.component';

@Component({
  selector: 'app-exit-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './exit-management.component.html',
  styleUrl: './exit-management.component.css'
})
export class ExitManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'employeeName', 'exitType', 'lastWorkingDate', 'initiatedDate', 
    'status', 'progress', 'actions'
  ];
  
  dataSource = new MatTableDataSource<ExitRequest>();
  allExitRequests: ExitRequest[] = [];
  
  selectedExitType = '';
  selectedStatus = '';
  filterValue = '';
  
  inProgressCount = 0;
  completedCount = 0;
  thisMonthCount = 0;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      return;
    }
    
    this.loadExitRequests();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadExitRequests(): void {
    this.employeeService.getExitRequests().subscribe((requests: ExitRequest[]) => {
      this.allExitRequests = requests;
      this.dataSource.data = requests;
      this.updateCounts();
    });
  }

  private updateCounts(): void {
    this.inProgressCount = this.allExitRequests.filter(r => r.status === 'In Progress').length;
    this.completedCount = this.allExitRequests.filter(r => r.status === 'Completed').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.thisMonthCount = this.allExitRequests.filter(r => {
      const initiatedDate = new Date(r.initiatedDate);
      return initiatedDate.getMonth() === currentMonth && 
             initiatedDate.getFullYear() === currentYear;
    }).length;
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyAllFilters();
  }

  filterByExitType(): void {
    this.applyAllFilters();
  }

  filterByStatus(): void {
    this.applyAllFilters();
  }

  private applyAllFilters(): void {
    // Reset the filterPredicate to use our combined filtering
    this.dataSource.filterPredicate = (data: ExitRequest, _) => {
      // Exit type filter
      const exitTypeMatch = !this.selectedExitType || data.exitType === this.selectedExitType;
      
      // Status filter
      const statusMatch = !this.selectedStatus || data.status === this.selectedStatus;
      
      // Text search filter
      const textMatch = !this.filterValue || 
        data.employeeName.toLowerCase().includes(this.filterValue) ||
        data.employeeId.toLowerCase().includes(this.filterValue);
      
      // All conditions must be true
      return exitTypeMatch && statusMatch && textMatch;
    };
    
    // Trigger the filter with a dummy value, actual filtering happens in filterPredicate
    this.dataSource.filter = 'trigger-filter';
  }

  clearFilters(): void {
    this.selectedExitType = '';
    this.selectedStatus = '';
    this.filterValue = '';
    
    // Clear any input field
    const searchInput = document.querySelector('.filters-card input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset dataSource filtering
    this.dataSource.filter = '';
  }

  initiateExit(): void {
    const dialogRef = this.dialog.open(InitiateExitDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.addExitRequest(result).subscribe({
          next: () => {
            this.loadExitRequests();
            this.snackBar.open('Exit process initiated successfully!', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error initiating exit process', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  markCompleted(request: ExitRequest): void {
    this.employeeService.updateExitRequest(request.id, { status: 'Completed' }).subscribe({
      next: () => {
        this.loadExitRequests();
        this.snackBar.open('Exit process marked as completed!', 'Close', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Error updating exit process', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getDaysUntilExit(lastWorkingDate: Date): string {
    const today = new Date();
    const exitDate = new Date(lastWorkingDate);
    const diffTime = exitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `${diffDays} days remaining`;
    }
  }

  isUrgent(lastWorkingDate: Date): boolean {
    const today = new Date();
    const exitDate = new Date(lastWorkingDate);
    const diffTime = exitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  getProgressValue(request: ExitRequest): number {
    const totalTasks = this.getTotalTasks(request);
    const completedTasks = this.getCompletedTasks(request);
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }

  getTotalTasks(request: ExitRequest): number {
    return request.tasks.length;
  }

  getCompletedTasks(request: ExitRequest): number {
    // For demo purposes, assume 50% completion for in-progress and 100% for completed
    if (request.status === 'Completed') {
      return request.tasks.length;
    }
    return Math.floor(request.tasks.length * 0.5);
  }

  getExitTypeColor(type: string): string {
    switch (type) {
      case 'Resignation': return 'primary';
      case 'Termination': return 'warn';
      case 'Retirement': return 'accent';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'In Progress': return 'accent';
      case 'Completed': return 'primary';
      default: return '';
    }
  }
}
