import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { LeaveRequest } from '../../../models/employee.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveActionDialogComponent } from '../dialogs/leave-action-dialog.component';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  templateUrl: './leave-management.component.html',
  styleUrl: './leave-management.component.css'
})
export class LeaveManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'employeeName', 'department', 'leaveType', 'duration', 'reason', 
    'requestDate', 'status', 'actions'
  ];
  
  dataSource = new MatTableDataSource<LeaveRequest>();
  allRequests: LeaveRequest[] = [];
  
  statusFilter = 'all';
  selectedDepartment = '';
  selectedLeaveType = '';
  filterValue = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  totalRequests = 0;
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  
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
    
    this.loadLeaveRequests();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadLeaveRequests(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.employeeService.getLeaveRequestsByManager(currentUser.id).subscribe(requests => {
        this.allRequests = requests;
        this.updateCounts();
        this.applyStatusFilter();
      });
    }
  }

  private updateCounts(): void {
    this.totalRequests = this.allRequests.length;
    this.pendingCount = this.allRequests.filter(r => r.status === 'Pending').length;
    this.approvedCount = this.allRequests.filter(r => r.status === 'Approved').length;
    this.rejectedCount = this.allRequests.filter(r => r.status === 'Rejected').length;
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyStatusFilter();
  }

  private applyStatusFilter(): void {
    let filteredRequests = this.allRequests;
    
    if (this.statusFilter !== 'all') {
      filteredRequests = this.allRequests.filter(r => r.status === this.statusFilter);
    }
    
    this.dataSource.data = filteredRequests;
    this.applyCustomFilter();
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyCustomFilter();
  }

  filterByDepartment(): void {
    this.applyCustomFilter();
  }

  filterByLeaveType(): void {
    this.applyCustomFilter();
  }
  
  filterByDateRange(): void {
    this.applyCustomFilter();
  }

  private applyCustomFilter(): void {
    this.dataSource.filterPredicate = (data: LeaveRequest, filter: string): boolean => {
      // Department filter
      const departmentMatch = !this.selectedDepartment || (data.department === this.selectedDepartment);
      
      // Leave type filter
      const leaveTypeMatch = !this.selectedLeaveType || (data.leaveType === this.selectedLeaveType);
      
      // Date range filter
      let dateMatch = true;
      if (data.requestDate) {
        const requestDate = new Date(data.requestDate);
        if (this.startDate) {
          dateMatch = dateMatch && (requestDate >= this.startDate);
        }
        if (this.endDate) {
          // Add one day to include the end date in the range
          const endDatePlusOne = new Date(this.endDate);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          dateMatch = dateMatch && (requestDate < endDatePlusOne);
        }
      }
      
      // Text search filter
      const textMatch = 
        this.filterValue === '' || 
        (data.employeeName && data.employeeName.toLowerCase().includes(this.filterValue)) ||
        (data.reason && data.reason.toLowerCase().includes(this.filterValue));
      
      // The filter predicate must return a boolean
      return Boolean(departmentMatch && leaveTypeMatch && dateMatch && textMatch);
    };
    
    // Apply filter with a dummy value to trigger filtering
    this.dataSource.filter = 'trigger-filter';
  }

  clearFilters(): void {
    this.selectedDepartment = '';
    this.selectedLeaveType = '';
    this.filterValue = '';
    this.startDate = null;
    this.endDate = null;
    
    // Reset to default filter predicate
    this.dataSource.filterPredicate = (data: LeaveRequest, filter: string): boolean => {
      // If no filter text, return all records
      if (!filter || filter === '') {
        return true;
      }
      // Otherwise filter using the default matcher
      return this.matchesDefaultFilter(data, filter);
    };
    
    // Clear the filter
    this.dataSource.filter = '';
  }
  
  private matchesDefaultFilter(data: LeaveRequest, filter: string): boolean {
    if (!filter) {
      return true;
    }
    
    const searchStr = (
      (data.employeeName || '') + ' ' +
      (data.leaveType || '') + ' ' +
      (data.reason || '') + ' ' +
      (data.department || '')
    ).toLowerCase();
    
    return Boolean(searchStr.includes(filter.toLowerCase()));
  }

  takeAction(request: LeaveRequest, action: 'approve' | 'reject' | 'changes'): void {
    const dialogRef = this.dialog.open(LeaveActionDialogComponent, {
      width: '500px',
      data: { request, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let status = '';
        switch (action) {
          case 'approve':
            status = 'Approved';
            break;
          case 'reject':
            status = 'Rejected';
            break;
          case 'changes':
            status = 'Changes Requested';
            break;
        }

        this.employeeService.updateLeaveRequest(request.id, status, result.comments).subscribe({
          next: () => {
            this.loadLeaveRequests();
            this.snackBar.open(`Leave request ${action}d successfully!`, 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error updating leave request', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  calculateDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getLeaveTypeColor(type: string): string {
    switch (type) {
      case 'Annual': return 'primary';
      case 'Sick': return 'warn';
      case 'Personal': return 'accent';
      case 'Maternity':
      case 'Paternity': return 'primary';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending': return 'accent';
      case 'Approved': return 'primary';
      case 'Rejected': return 'warn';
      case 'Changes Requested': return '';
      default: return '';
    }
  }
}
