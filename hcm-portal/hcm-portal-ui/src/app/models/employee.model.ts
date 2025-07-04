export interface Employee {
  employeeId: string;
  fullName: string;
  dateOfJoining: Date;
  department: string;
  designation: string;
  managerName: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  role: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  managerId?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  requestDate: Date;
  managerComments?: string;
  department: string;
}

export interface ExitRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  exitType: 'Resignation' | 'Termination' | 'Retirement';
  lastWorkingDate: Date;
  offboardingNotes: string;
  tasks: string[];
  status: 'In Progress' | 'Completed';
  initiatedDate: Date;
  initiatedBy: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Manager' | 'Admin' | 'Employee';
  employeeId: string;
  department: string;
}

// Model for chatbot API response
export interface ChatbotApiResponse {
  response: string;
  session_id: string;
}
