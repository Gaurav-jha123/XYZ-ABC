import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-edit-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './edit-employee-dialog.component.html',
  styleUrl: './edit-employee-dialog.component.css'
})
export class EditEmployeeDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.editForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: [{value: this.data.fullName, disabled: true}, [Validators.required]],
      employmentType: [this.data.employmentType, [Validators.required]],
      status: [this.data.status, [Validators.required]],
      role: [this.data.role, [Validators.required]],
      designation: [{value: this.data.designation, disabled: true}, [Validators.required]],
      email: [this.data.contactInfo?.email || '', [Validators.email]],
      phone: [this.data.contactInfo?.phone || ''],
      address: [this.data.contactInfo?.address || '']
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      const rawValue = this.editForm.getRawValue(); // Gets values even from disabled controls
      const updatedEmployee = {
        ...this.data,
        employmentType: rawValue.employmentType,
        status: rawValue.status,
        role: rawValue.role,
        contactInfo: {
          ...(this.data.contactInfo || {}),
          email: rawValue.email,
          phone: rawValue.phone,
          address: rawValue.address
        }
      };
      
      this.dialogRef.close(updatedEmployee);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
