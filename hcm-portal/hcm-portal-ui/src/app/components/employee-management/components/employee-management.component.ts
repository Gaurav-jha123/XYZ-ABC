import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { Employee } from '../../../models/employee.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditEmployeeDialogComponent } from '../dialogs/edit-dialog/edit-employee-dialog.component';
import { ViewEmployeeDialogComponent } from '../dialogs/view-dialog/view-employee-dialog.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css'
})
export class EmployeeManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'employeeId', 'fullName', 'department', 'designation', 
    'employmentType', 'status', 'dateOfJoining', 'actions'
  ];
  
  dataSource = new MatTableDataSource<Employee>();
  selectedDepartment = '';
  selectedStatus = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.authService.isManager()) {
      return;
    }
    
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadEmployees(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.employeeService.getEmployeesByManager(currentUser.id).subscribe(employees => {
        this.dataSource.data = employees;
      });
    }
  }

  filterValue: string = '';

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyCustomFilter();
  }

  filterByDepartment(): void {
    this.applyCustomFilter();
  }

  filterByStatus(): void {
    this.applyCustomFilter();
  }
  
  filterByDateRange(): void {
    this.applyCustomFilter();
  }

  private applyCustomFilter(): void {
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const departmentMatch = !this.selectedDepartment || data.department === this.selectedDepartment;
      const statusMatch = !this.selectedStatus || data.status === this.selectedStatus;
      
      // Date range filtering
      let dateMatch = true;
      if (data.dateOfJoining) {
        const joiningDate = new Date(data.dateOfJoining);
        if (this.startDate) {
          dateMatch = dateMatch && joiningDate >= this.startDate;
        }
        if (this.endDate) {
          // Add one day to include the end date in the range
          const endDatePlusOne = new Date(this.endDate);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          dateMatch = dateMatch && joiningDate < endDatePlusOne;
        }
      }
      
      // Use the stored filterValue for text matching
      const textMatch = this.filterValue === '' || 
        data.fullName.toLowerCase().includes(this.filterValue) ||
        (data.employeeId && data.employeeId.toLowerCase().includes(this.filterValue)) ||
        data.designation.toLowerCase().includes(this.filterValue);
      
      return departmentMatch && statusMatch && dateMatch && textMatch;
    };
    
    // Apply filter with a dummy value to trigger filtering
    this.dataSource.filter = 'trigger-filter';
  }

  clearFilters(): void {
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.filterValue = '';
    this.startDate = null;
    this.endDate = null;
    
    // Reset to default filter predicate
    this.dataSource.filterPredicate = (data, filter) => {
      return filter === '' || this.matchesDefaultFilter(data, filter);
    };
    
    this.dataSource.filter = '';
  }
  
  private matchesDefaultFilter(data: Employee, filter: string): boolean {
    const searchStr = (data.fullName + ' ' + 
                     (data.employeeId || '') + ' ' + 
                     data.designation + ' ' + 
                     data.department).toLowerCase();
    return searchStr.includes(filter.toLowerCase());
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      width: '500px',
      data: { ...employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.updateEmployee(employee.employeeId, result).subscribe({
          next: () => {
            this.loadEmployees();
            this.snackBar.open('Employee updated successfully!', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error updating employee', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  
  viewEmployee(employee: Employee): void {
    this.dialog.open(ViewEmployeeDialogComponent, {
      width: '650px',
      data: { ...employee }
    });
  }

  getEmploymentTypeColor(type: string): string {
    switch (type) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'accent';
      case 'Contract': return 'warn';
      case 'Intern': return '';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'primary';
      case 'On Leave': return 'accent';
      case 'Inactive': return 'warn';
      case 'Terminated': return 'warn';
      default: return '';
    }
  }
}
