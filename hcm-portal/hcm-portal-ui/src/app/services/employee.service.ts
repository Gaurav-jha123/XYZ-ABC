import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Employee, LeaveRequest, ExitRequest, User, ChatbotApiResponse } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      employeeId: 'EMP001',
      fullName: 'John Doe',
      dateOfJoining: new Date('2022-01-15'),
      department: 'Engineering',
      designation: 'Senior Developer',
      managerName: 'Sarah Johnson',
      employmentType: 'Full-time',
      contactInfo: {
        email: 'john.doe@company.com',
        phone: '+1-555-0123',
        address: '123 Main St, City, State 12345'
      },
      role: 'Developer',
      status: 'Active',
      managerId: 'MGR001'
    },
    {
      employeeId: 'EMP002',
      fullName: 'Jane Smith',
      dateOfJoining: new Date('2021-03-20'),
      department: 'Marketing',
      designation: 'Marketing Specialist',
      managerName: 'Mike Wilson',
      employmentType: 'Full-time',
      contactInfo: {
        email: 'jane.smith@company.com',
        phone: '+1-555-0124',
        address: '456 Oak Ave, City, State 12345'
      },
      role: 'Specialist',
      status: 'Active',
      managerId: 'MGR002'
    }
  ];

  private leaveRequests: LeaveRequest[] = [
    {
      id: 'LR001',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      leaveType: 'Annual',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-05'),
      reason: 'Family vacation',
      status: 'Pending',
      requestDate: new Date('2024-06-15'),
      department: 'Engineering'
    }
  ];

  private exitRequests: ExitRequest[] = [];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);
  private leaveRequestsSubject = new BehaviorSubject<LeaveRequest[]>(this.leaveRequests);
  private exitRequestsSubject = new BehaviorSubject<ExitRequest[]>(this.exitRequests);

  constructor(private http: HttpClient) { }

  // Employee Management
  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getEmployeesByManager(managerId: string): Observable<Employee[]> {
    const filteredEmployees = this.employees.filter(emp => emp.managerId === managerId);
    return of(filteredEmployees);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    this.employees.push(employee);
    this.employeesSubject.next([...this.employees]);
    return of(employee);
  }

  updateEmployee(employeeId: string, updates: Partial<Employee>): Observable<Employee> {
    const index = this.employees.findIndex(emp => emp.employeeId === employeeId);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates };
      this.employeesSubject.next([...this.employees]);
      return of(this.employees[index]);
    }
    throw new Error('Employee not found');
  }

  // Leave Management
  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.leaveRequestsSubject.asObservable();
  }

  getLeaveRequestsByManager(managerId: string): Observable<LeaveRequest[]> {
    const managerEmployees = this.employees.filter(emp => emp.managerId === managerId);
    const employeeIds = managerEmployees.map(emp => emp.employeeId);
    const filteredRequests = this.leaveRequests.filter(req => employeeIds.includes(req.employeeId));
    return of(filteredRequests);
  }

  updateLeaveRequest(requestId: string, status: string, comments?: string): Observable<LeaveRequest> {
    const index = this.leaveRequests.findIndex(req => req.id === requestId);
    if (index !== -1) {
      this.leaveRequests[index] = { 
        ...this.leaveRequests[index], 
        status: status as any,
        managerComments: comments 
      };
      this.leaveRequestsSubject.next([...this.leaveRequests]);
      return of(this.leaveRequests[index]);
    }
    throw new Error('Leave request not found');
  }

  // Exit Management
  getExitRequests(): Observable<ExitRequest[]> {
    return this.exitRequestsSubject.asObservable();
  }

  addExitRequest(exitRequest: ExitRequest): Observable<ExitRequest> {
    this.exitRequests.push(exitRequest);
    this.exitRequestsSubject.next([...this.exitRequests]);
    return of(exitRequest);
  }

  updateExitRequest(requestId: string, updates: Partial<ExitRequest>): Observable<ExitRequest> {
    const index = this.exitRequests.findIndex(req => req.id === requestId);
    if (index !== -1) {
      this.exitRequests[index] = { ...this.exitRequests[index], ...updates };
      this.exitRequestsSubject.next([...this.exitRequests]);
      return of(this.exitRequests[index]);
    }
    throw new Error('Exit request not found');
  }

  getChatbotResponse(userMessage: string): Observable<string> {
    const apiUrl = 'http://localhost:8080/chat'; // Replace with your actual API URL
    return this.http.post<ChatbotApiResponse>(apiUrl, { query: userMessage }).pipe(
      map((res: ChatbotApiResponse) => {
        return res.response || 'No response from chatbot.';
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return of('Sorry, I could not process your request at this time.');
      })
    );
  }
}
