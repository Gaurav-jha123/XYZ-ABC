using HCM.Application.Interfaces;
using HCM.Domain.Entities;
using HCM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCM.Infrastructure.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly HCMDbContext _context;

        public EmployeeService(HCMDbContext context)
        {
            _context = context;
        }

        public async Task AddEmployeeAsync(Employee employee)
        {
            employee.Id = Guid.NewGuid();
            await _context.Employees.AddAsync(employee);

            // Also add to User table
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = employee.EmployeeId,
                PasswordHash = "Default@123", //Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes("Default@123"))), // Default password; consider hashing and changing later
                Role = employee.Role
            };
            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Employee>> GetEmployeesByManagerAsync(string managerName)
        {
            return await _context.Employees
                .Where(e => e.ManagerName == managerName)
                .ToListAsync();
        }
        public async Task<Employee> GetEmployeesByUserNameAsync(string userName)
        {
            return await _context.Employees
                .Where(e => e.EmployeeId == userName)
                .SingleOrDefaultAsync();
        }
        public async Task<IEnumerable<Employee>> GetEmployeesByFiltersAsync(string managerName, string? department, string? employmentStatus, DateTime? dateOfJoining)
        {
            var query = _context.Employees.AsQueryable();

            query = query.Where(e => e.ManagerName == managerName);

            if (!string.IsNullOrWhiteSpace(department))
                query = query.Where(e => e.Department == department);

            if (!string.IsNullOrWhiteSpace(employmentStatus))
                query = query.Where(e => e.Status == employmentStatus);

            if (dateOfJoining.HasValue)
                query = query.Where(e => e.DateOfJoining.Date == dateOfJoining.Value.Date);

            return await query.ToListAsync();
        }

        public async Task UpdateEmployee1Async(Employee employee)
        {
            var existing = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employee.Id);
            if (existing is not null)
            {
                existing.FullName = employee.FullName;
                existing.EmploymentType = employee.EmploymentType;
                existing.Role = employee.Role;
                existing.Status = employee.Status;
                existing.Department = employee.Department;
                existing.Designation = employee.Designation;
                existing.ContactInfo = employee.ContactInfo;
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            var existing = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employee.Id);
            if (existing is not null)
            {
                    existing.FullName = employee.FullName;
                    existing.EmploymentType = employee.EmploymentType;
                    existing.Role = employee.Role;
                    existing.Status = employee.Status;
                    existing.Department = employee.Department;
                    existing.Designation = employee.Designation;
                    existing.ContactInfo = employee.ContactInfo;
                    await _context.SaveChangesAsync();
            }
        }





    }
}
