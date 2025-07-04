import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/employee.model';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ChatbotComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  isHandset = false;
  currentUser = this.authService.getCurrentUser();
  constructor(public authService: AuthService) {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  switchRole(role: 'Manager' | 'Admin'): void {
    this.authService.switchRole(role);
  }

  logout(): void {
    this.authService.logout();
  }
}
