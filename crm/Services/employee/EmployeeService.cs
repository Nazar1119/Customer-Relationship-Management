using crm.Data;
using crm.dto.employee;
using crm.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Security.Cryptography;
using System.Text;

namespace crm.Services.employee
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordGenerator _passwordGenerator;
        private readonly IHashPassword _hashPassword;
        private readonly IEmailService _emailService;

        public EmployeeService(AppDbContext context, IPasswordGenerator passwordGenerator, IHashPassword hashPassword, IEmailService emailService) 
        {
            _context = context;
            _passwordGenerator = passwordGenerator;
            _hashPassword = hashPassword;
            _emailService = emailService;
        }

        public async Task<Employee?> CreateEmployee(EmployeeCreationDTO request)
        {
            if(_context.Employees.Any(e => e.Email == request.Email))
            {
                throw new InvalidOperationException("Employee with this email already exists.");
            }

            string password = _passwordGenerator.GeneratePassword(8);

            string hashPassword = _hashPassword.Hash(password);

            var employee = new Employee()
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = hashPassword,
                Role = request.Role,
                Phone = request.Phone,
                Department = request.Department,
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            await _emailService.SendEmail(
                request.Email,
                "CRM Auth",
                $"Welcome, {request.FirstName} {request.LastName}!\nYour password for account: {password}"
);

            return employee;
        }

        public async Task<bool> DeleteEmployeeById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            
            if(employee == null)
            {
                throw new InvalidOperationException($"Employee with ID {id} not found.");
            }

            _context.Employees.Remove(employee);
            int changes = await _context.SaveChangesAsync();

            return changes > 0;
        }

        public async Task<Employee?> UpdateEmployeeById(EmployeeUpdateDTO request, int id)
        {
            var updateEmployee = await _context.Employees.FindAsync(id);

            if (updateEmployee == null)
            {
                throw new InvalidOperationException($"Employee for update with ID {id} not found.");
            }

            if (request.FirstName != null)
                updateEmployee.FirstName = request.FirstName;

            if (request.LastName != null)
                updateEmployee.LastName = request.LastName;

            if (request.Email != null)
                updateEmployee.Email = request.Email;

            if (request.Role != null)
                updateEmployee.Role = request.Role;

            if (request.Phone != null)
                updateEmployee.Phone = request.Phone;

            if (request.Department != null)
                updateEmployee.Department = request.Department;

            await _context.SaveChangesAsync();

            return updateEmployee;
        }

        public async Task<Employee?> ReadEmployeeById(int id)
        {
            return await _context.Employees.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Employee>> ReadAllEmployee()
        {
            return await _context.Employees.AsNoTracking().ToListAsync();
        }
    }
}
