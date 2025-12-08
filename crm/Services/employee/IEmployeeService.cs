using crm.dto.employee;
using crm.Models;
namespace crm.Services.employee
{
    public interface IEmployeeService
    {
        Task<Employee?> CreateEmployee(EmployeeCreationDTO request);
        
        Task<bool> DeleteEmployeeById(int id);

        Task<Employee?> UpdateEmployeeById(EmployeeUpdateDTO request, int id);

        Task<Employee?> ReadEmployeeById(int id);

        Task<List<Employee>> ReadAllEmployee();

    }
}
