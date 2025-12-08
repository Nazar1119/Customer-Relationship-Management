using crm.Models;

namespace crm.dto.device
{
    public class DeviceCreateDTO
    {
        public string SerialNumber { get; set; } = null!;
        public string DeviceType { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string? Notes { get; set; }
    }
}
