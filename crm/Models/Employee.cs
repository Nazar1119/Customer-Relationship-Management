using System.ComponentModel.DataAnnotations;

namespace crm.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        public string PasswordHash { get; set; } = null!;
        [Required]
        public string Role { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Department { get; set; } = null!;
        [Required]
        public string Phone { get; set; } = null!;

    }
}
