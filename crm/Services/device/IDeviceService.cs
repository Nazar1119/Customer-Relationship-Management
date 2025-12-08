using crm.dto.device;
using crm.Models;

namespace crm.Services.device
{
    public interface IDeviceService
    {
        Task<Device?> CreateDeviceByClientId(DeviceCreateDTO dto, int clientId);

        Task<Device?> UpdateDeviceById(DeviceUpdateDTO dto, int id);

        Task<bool> DeleteDeviceById(int id);

        Task<Device?> ReadDeviceById(int id);

        Task<List<Device>> ReadAllDevices();

        Task<List<Device>> ReadAllDevicesByClientId(int clientId);
    }
}
