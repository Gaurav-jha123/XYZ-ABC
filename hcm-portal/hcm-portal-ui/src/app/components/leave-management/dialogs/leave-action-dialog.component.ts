import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaveRequest } from '../../../models/employee.model';

interface DialogData {
  request: LeaveRequest;
  action: 'approve' | 'reject' | 'changes';
}

@Component({
  selector: 'app-leave-action-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './leave-action-dialog.component.html',
  styleUrl: './leave-action-dialog.component.css'
})
export class LeaveActionDialogComponent {
  actionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.actionForm = this.fb.group({
      comments: ['']
    });
  }

  getTitle(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Approve Leave Request';
      case 'reject':
        return 'Reject Leave Request';
      case 'changes':
        return 'Request Changes';
      default:
        return 'Leave Action';
    }
  }

  getActionLabel(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Approval Comments';
      case 'reject':
        return 'Rejection Comments';
      case 'changes':
        return 'Change Request Comments';
      default:
        return 'Comments';
    }
  }

  getPlaceholder(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Optional: Add approval comments...';
      case 'reject':
        return 'Please provide reason for rejection...';
      case 'changes':
        return 'Please specify what changes are needed...';
      default:
        return 'Add your comments...';
    }
  }

  getHint(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Comments are optional for approval';
      case 'reject':
        return 'Comments are recommended for rejection';
      case 'changes':
        return 'Please be specific about required changes';
      default:
        return '';
    }
  }

  getButtonColor(): string {
    switch (this.data.action) {
      case 'approve':
        return 'primary';
      case 'reject':
        return 'warn';
      case 'changes':
        return 'accent';
      default:
        return 'primary';
    }
  }

  getConfirmText(): string {
    switch (this.data.action) {
      case 'approve':
        return 'Approve Request';
      case 'reject':
        return 'Reject Request';
      case 'changes':
        return 'Request Changes';
      default:
        return 'Confirm';
    }
  }

  onConfirm(): void {
    const comments = this.actionForm.get('comments')?.value || '';
    this.dialogRef.close({ comments });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
