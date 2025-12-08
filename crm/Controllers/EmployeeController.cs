using crm.dto;
using crm.dto.employee;
using crm.Models;
using crm.Services.employee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



namespace crm.Controllers
{
    [ApiController]
    [Route("employee")]
    public class EmployeeController : Controller
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreationDTO request)
        {
            try
            {
                var newEmployee = await _employeeService.CreateEmployee(request);

                if (newEmployee == null)
                {
                    return BadRequest("Failed to create employee.");
                }

                return Ok(newEmployee);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteEmployeeById(int id)
        {
            try
            {
                var deleteEmployee = await _employeeService.DeleteEmployeeById(id);

                if (!deleteEmployee)
                {
                    return NotFound($"Employee with ID {id} not found.");
                }
                else
                {
                    return NoContent();
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while attempting to delete the employee.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEmployeeById([FromBody] EmployeeUpdateDTO request, int id)
        {
            try
            {
                var updateEmployee = await _employeeService.UpdateEmployeeById(request, id);

                if (updateEmployee == null)
                {
                    return NotFound($"Employee for update with id {id} not found.");
                }

                var response = new EmployeeUpdateDTOResponse
                {
                    Id = updateEmployee.Id,
                    FirstName = updateEmployee.FirstName,
                    LastName = updateEmployee.LastName,
                    Email = updateEmployee.Email,
                    Role = updateEmployee.Role,
                    Department = updateEmployee.Department,
                    Phone = updateEmployee.Phone
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("get/{id}")]
        public async Task<IActionResult> ReadEmployeeById(int id)
        {
            var employee = await _employeeService.ReadEmployeeById(id);

            if (employee == null)
            {
                return NotFound($"Employee with id {id} not found.");
            }

            var response = new EmployeeReadDTOResponse
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                Role = employee.Role,
                Department = employee.Department,
                Phone = employee.Phone
            };

            return Ok(response);
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("get")]
        public async Task<IActionResult> ReadAllEmployees()
        {
            var employees = await _employeeService.ReadAllEmployee();

            var response = employees.Select(e => new EmployeeReadDTOResponse
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Role = e.Role,
                Department = e.Department,
                Phone = e.Phone
            }).ToList();

            return Ok(response);
        }

    }
}
