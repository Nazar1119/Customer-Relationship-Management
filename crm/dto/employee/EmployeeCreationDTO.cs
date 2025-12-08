using System.ComponentModel.DataAnnotations;

namespace crm.dto.employee
{
    public class EmployeeCreationDTO
    {
     
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Role { get; set; } = null!;
        [Required]
        public string Department { get; set; } = null!;
        [Required]
        [Phone]
        public string Phone { get; set; } = null!;
    }
}
