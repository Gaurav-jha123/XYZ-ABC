import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-view-employee-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './view-employee-dialog.component.html',
  styleUrl: './view-employee-dialog.component.css'
})
export class ViewEmployeeDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: Employee
  ) {}

  onClose(): void {
    this.dialogRef.close();
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
