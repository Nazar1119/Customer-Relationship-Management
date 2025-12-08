namespace crm.dto.client
{
    public class ClientCreateDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; } = "New";
        public int? AssignedEmployeeId { get; set; } 
    }


}
