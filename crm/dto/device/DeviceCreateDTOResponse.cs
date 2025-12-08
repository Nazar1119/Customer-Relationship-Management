namespace crm.dto.device
{
    public class DeviceCreateDTOResponse
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; } = null!;
        public string DeviceType { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string? Notes { get; set; }
    }

}
