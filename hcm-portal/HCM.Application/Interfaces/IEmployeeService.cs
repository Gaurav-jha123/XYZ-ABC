using HCM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCM.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task AddEmployeeAsync(Employee employee);
      //  Task<IEnumerable<Employee>> GetEmployeesByManagerAsync(string managerName);
        Task<IEnumerable<Employee>> GetEmployeesByManagerAsync(string managerName);
        Task<IEnumerable<Employee>> GetEmployeesByFiltersAsync(string managerName, string? department, string? employmentStatus, DateTime? dateOfJoining);
        Task<Employee> GetEmployeesByUserNameAsync(string userName);
        Task UpdateEmployeeAsync(Employee employee);
    }
}
