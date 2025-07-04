using HCM.Application.Interfaces;
using HCM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HCM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee(Employee employee)
        {
            await _employeeService.AddEmployeeAsync(employee);
            return Ok();
        }

        [HttpGet]
        [Route("GetManagerEmployeeDetails")]

        public async Task<IActionResult> GetEmployees()
        {
            var username = User.Identity?.Name;
            var employees = await _employeeService.GetEmployeesByManagerAsync(username);
            return Ok(employees);
        }

        [HttpGet]
        [Route("GetEmployeeDetails")]
        public async Task<IActionResult> GetEmployeeDetails()
        {
            var username = User.Identity?.Name;
            var employees = await _employeeService.GetEmployeesByUserNameAsync(username);
            return Ok(employees);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetEmployees([FromQuery] string? department, [FromQuery] string? employmentStatus, [FromQuery] DateTime? dateOfJoining)
        {
            var managerName = User.FindFirstValue(ClaimTypes.Name);
            var employees = await _employeeService.GetEmployeesByFiltersAsync(managerName, department, employmentStatus, dateOfJoining);
            return Ok(employees);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateEmployee([FromBody] Employee employee)
        {
            await _employeeService.UpdateEmployeeAsync(employee);
            return Ok();
        }

    }


}
