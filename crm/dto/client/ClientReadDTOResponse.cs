using crm.dto.device;

namespace crm.dto.client
{
    public class ClientReadDTOResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int? AssignedEmployeeId { get; set; }

        public List<DeviceDTO> Devices { get; set; } = new();
    }
}
