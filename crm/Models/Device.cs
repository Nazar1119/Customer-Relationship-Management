namespace crm.Models
{
    public class Device
    {
        public int Id { get; set; }

        public string SerialNumber { get; set; } = null!;
        public string DeviceType { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string? Notes { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;
    }

}
