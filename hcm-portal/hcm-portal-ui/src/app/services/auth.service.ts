import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Mock users for demo purposes
  private users: User[] = [
    {
      id: 'MGR001',
      username: 'sarah.johnson',
      role: 'Manager',
      employeeId: 'EMP_MGR001',
      department: 'Engineering'
    },
    {
      id: 'MGR002',
      username: 'mike.wilson',
      role: 'Manager',
      employeeId: 'EMP_MGR002',
      department: 'Marketing'
    },
    {
      id: 'ADM001',
      username: 'admin',
      role: 'Admin',
      employeeId: 'EMP_ADM001',
      department: 'HR'
    }
  ];

  constructor() {
    // Set default user for demo - Manager
    this.currentUserSubject.next(this.users[0]);
  }

  login(username: string, password: string): Observable<User | null> {
    const user = this.users.find(u => u.username === username);
    if (user) {
      this.currentUserSubject.next(user);
      return new BehaviorSubject(user).asObservable();
    }
    return new BehaviorSubject(null).asObservable();
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Manager';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  switchRole(role: 'Manager' | 'Admin'): void {
    const user = this.users.find(u => u.role === role);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }
}
