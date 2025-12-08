namespace crm.dto.device
{
    public class DeviceDTO
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; }
        public string DeviceType { get; set; }
        public string Model { get; set; }

        public string? Note { get; set; }
    }

}
