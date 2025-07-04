# HCM Portal UI

A comprehensive Human Capital Management (HCM) portal built with Angular 17 and Angular Material, featuring role-based access control for Managers and Admins.

## Features

### Manager Functions
1. **Add New Employee Record**
   - Form-based employee creation with validation
   - Fields: Employee ID, Full Name, Date of Joining, Department, Designation, Manager Name, Employment Type
   - Contact information management
   - Data persistence and confirmation messages

2. **View and Manage Employee Master Data**
   - Searchable and paginated employee list
   - Advanced filters: Department, Employment Status, Date of Joining
   - Inline editing capabilities for Contact Info, Employment Type, Role, Status
   - Manager-specific employee visibility (only employees reporting to logged-in manager)

3. **Manage Leave Requests**
   - Review leave requests from team members
   - Filter by Date, Status, Department
   - Actions: Approve, Reject, Request Changes with comments
   - Status transition tracking
   - Real-time counts and statistics

### Admin Functions
4. **Initiate Employee Exit Process**
   - Employee selection with detailed information display
   - Exit type selection: Resignation, Termination, Retirement
   - Last working date configuration
   - Offboarding notes and task management
   - Progress tracking dashboard
   - Status management (In Progress, Completed)

## Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material 17
- **Styling**: Material Design with custom themes
- **State Management**: RxJS with BehaviorSubjects
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router
- **Build Tool**: Angular CLI

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Installation
```bash
# Navigate to project directory
cd hcm-portal-ui

# Install dependencies
npm install

# Start development server
ng serve

# Open browser to http://localhost:4200
```

## Role-Based Access Control

### Manager Role (Default)
- Access to team member management
- Employee creation and editing
- Leave request approvals
- Limited to employees under their management

### Admin Role
- Full employee exit process management
- Company-wide statistics
- System administration functions

**To switch roles**: Click on the user menu in the top-right corner and select "Switch to Admin" or "Switch to Manager"

## Key Features Implemented

✅ **Add New Employee Record** - Complete form with validation and persistence  
✅ **Employee Master Data Management** - Searchable list with filters and editing  
✅ **Leave Request Management** - Full workflow with approval/rejection  
✅ **Employee Exit Process** - Complete exit initiation and tracking  
✅ **Role-based Access Control** - Manager and Admin specific features  
✅ **Responsive Design** - Mobile-friendly interface  
✅ **Material Design** - Consistent UI/UX with Angular Material  

## Demo Usage

1. **Dashboard**: Overview of statistics and quick actions based on your role
2. **Add Employee** (Manager): Create new employee records with comprehensive forms
3. **Manage Employees** (Manager): View, search, filter, and edit employee information
4. **Leave Requests** (Manager): Review and act on leave requests from your team
5. **Employee Exit** (Admin): Initiate and track employee exit processes

## Development

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
