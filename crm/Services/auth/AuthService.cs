using crm.Data;
using crm.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace crm.Services.auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHashPassword _hashPassword;

        public AuthService(AppDbContext context, IConfiguration configuration, IHashPassword hashPassword)
        {
            _context = context;
            _configuration = configuration;
            _hashPassword = hashPassword;
        }


        public async Task<Employee?> Login(string Email, string Password)
        {
            var user = await _context.Employees.FirstOrDefaultAsync(x => x.Email == Email);

            if (user == null)
            {
                return null;
            }

            if (user.PasswordHash != _hashPassword.Hash(Password)) 
            {
                return null;
            }

            return user;
        }

        public string GenerateJwt(Employee user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)

            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var sign = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken
            (
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(12),
                signingCredentials: sign
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
