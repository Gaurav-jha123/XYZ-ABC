import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if user is authorized
    if (!this.authService.isManager()) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      employeeId: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      dateOfJoining: ['', [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      employmentType: ['', [Validators.required]],
      managerName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      role: ['']
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      const formValue = this.employeeForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      const employee: Employee = {
        employeeId: formValue.employeeId,
        fullName: formValue.fullName,
        dateOfJoining: formValue.dateOfJoining,
        department: formValue.department,
        designation: formValue.designation,
        managerName: formValue.managerName,
        employmentType: formValue.employmentType,
        contactInfo: {
          email: formValue.email || '',
          phone: formValue.phone || '',
          address: formValue.address || ''
        },
        role: formValue.role || formValue.designation,
        status: 'Active',
        managerId: currentUser?.id
      };

      this.employeeService.addEmployee(employee).subscribe({
        next: (result) => {
          this.isSubmitting = false;
          this.snackBar.open('Employee added successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error adding employee. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
