import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { Employee, ExitRequest } from '../../../models/employee.model';

@Component({
  selector: 'app-initiate-exit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './initiate-exit-dialog.component.html',
  styleUrl: './initiate-exit-dialog.component.css'
})
export class InitiateExitDialogComponent implements OnInit {
  exitForm: FormGroup;
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  
  defaultTasks = [
    'Collect company laptop and equipment',
    'Deactivate system access and accounts',
    'Collect ID badge and access cards',
    'Conduct exit interview',
    'Process final payroll and benefits',
    'Return company documents and files',
    'Complete knowledge transfer',
    'Update organizational chart',
    'Notify clients and stakeholders'
  ];
  
  selectedTasks: string[] = [...this.defaultTasks];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<InitiateExitDialogComponent>
  ) {
    this.exitForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      employeeId: ['', [Validators.required]],
      exitType: ['', [Validators.required]],
      lastWorkingDate: ['', [Validators.required]],
      offboardingNotes: ['', [Validators.required]],
      additionalTasks: ['']
    });
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees.filter((emp: Employee) => emp.status === 'Active');
    });
  }

  onEmployeeSelect(event: any): void {
    const employeeId = event.value;
    this.selectedEmployee = this.employees.find(emp => emp.employeeId === employeeId) || null;
  }

  toggleTask(task: string, event: any): void {
    if (event.checked) {
      if (!this.selectedTasks.includes(task)) {
        this.selectedTasks.push(task);
      }
    } else {
      this.selectedTasks = this.selectedTasks.filter(t => t !== task);
    }
  }

  onSubmit(): void {
    if (this.exitForm.valid && this.selectedEmployee) {
      const formValue = this.exitForm.value;
      
      // Process additional tasks
      const additionalTasks = formValue.additionalTasks
        ? formValue.additionalTasks.split('\n').filter((task: string) => task.trim())
        : [];
      
      const allTasks = [...this.selectedTasks, ...additionalTasks];
      
      const exitRequest: ExitRequest = {
        id: this.generateId(),
        employeeId: formValue.employeeId,
        employeeName: this.selectedEmployee.fullName,
        exitType: formValue.exitType,
        lastWorkingDate: formValue.lastWorkingDate,
        offboardingNotes: formValue.offboardingNotes,
        tasks: allTasks,
        status: 'In Progress',
        initiatedDate: new Date(),
        initiatedBy: 'Current User' // In real app, get from auth service
      };
      
      this.dialogRef.close(exitRequest);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private generateId(): string {
    return 'EXIT' + Date.now().toString();
  }
}
