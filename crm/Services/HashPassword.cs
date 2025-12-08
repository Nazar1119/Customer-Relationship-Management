
using System.Security.Cryptography;
using System.Text;
namespace crm.Services
{
    public class HashPassword : IHashPassword
    {
        public string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
