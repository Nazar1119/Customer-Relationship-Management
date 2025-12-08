namespace crm.Models
{
    public class Client
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int? AssignedEmployeeId { get; set; }
        public Employee? AssignedEmployee { get; set; }

        public List<Device> Devices { get; set; } = new();
    }

}
