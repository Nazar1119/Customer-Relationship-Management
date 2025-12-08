using crm.Models;

namespace crm.Services.auth
{
    public interface IAuthService
    {
        Task<Employee?> Login(string Email, string Password);
        string GenerateJwt(Employee employee);
    }
}
