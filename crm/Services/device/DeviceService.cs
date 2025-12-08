using crm.Data;
using crm.dto.device;
using crm.Models;
using Microsoft.EntityFrameworkCore;
namespace crm.Services.device
{
    public class DeviceService : IDeviceService
    {
        private readonly AppDbContext _context;

        public DeviceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Device?> CreateDeviceByClientId(DeviceCreateDTO dto, int clientId)
        {
            var client = await _context.Clients.FindAsync(clientId);

            if (client == null)
            {
                throw new InvalidOperationException($"Client not found by Id {clientId}");
            }

            var device = new Device
            {
                SerialNumber = dto.SerialNumber,
                DeviceType = dto.DeviceType,
                Model = dto.Model,
                Notes = dto.Notes,
                ClientId = clientId
            };

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            return device;
        }

        public async Task<Device?> UpdateDeviceById(DeviceUpdateDTO dto, int id)
        {
            var updateDevice = await _context.Devices.FindAsync(id);
            if (updateDevice == null) { throw new InvalidOperationException($"Device with {id} not found"); }

            if (dto.SerialNumber != null)
                updateDevice.SerialNumber = dto.SerialNumber;

            if (dto.DeviceType != null)
                updateDevice.DeviceType = dto.DeviceType;

            if (dto.Model != null)
                updateDevice.Model = dto.Model;

            if (dto.Notes != null)
                updateDevice.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return updateDevice;
        }

        public async Task<bool> DeleteDeviceById(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                throw new InvalidOperationException($"Client with ID {id} not found.");
            }

            _context.Devices.Remove(device);
            int changes = await _context.SaveChangesAsync();

            return changes > 0;
        }

        public async Task<Device?> ReadDeviceById(int id)
        {
            return await _context.Devices.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Device>> ReadAllDevices()
        {
            return await _context.Devices.AsNoTracking().ToListAsync();
        }

        public async Task<List<Device>> ReadAllDevicesByClientId(int clientId)
        {
            return await _context.Devices
                .Where(d => d.ClientId == clientId)
                .AsNoTracking()
                .ToListAsync();
        }

    }
}
