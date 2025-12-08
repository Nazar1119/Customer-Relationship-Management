using crm.Data;
using crm.dto.client;
using crm.Models;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.client
{
    public class ClientService : IClientService
    {
        private readonly AppDbContext _context;

        public ClientService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<Client?> CreateClient(ClientCreateDTO dto)
        {
            if (dto == null)
                return null;

            var client = new Client
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Status = dto.Status,
                AssignedEmployeeId = dto.AssignedEmployeeId
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task<Client?> ReadClientById(int id)
        {
            return await _context.Clients
                .Include(c => c.Devices)
                .Include(c => c.AssignedEmployee) 
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
        }


        public async Task<List<Client>> ReadAllClients()
        {
            return await _context.Clients
                .Include(c => c.Devices)
                .Include(c => c.AssignedEmployee)
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task<bool> DeleteClientById(int id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                throw new InvalidOperationException($"Client with ID {id} not found.");
            }

            _context.Clients.Remove(client);
            int changes = await _context.SaveChangesAsync();

            return changes > 0;
        }

        public async Task<Client?> UpdateClientById(ClientUpdateDTO dto, int id)
        {
            var updateClient = await _context.Clients.FindAsync(id);

            if (updateClient == null)
            {
                throw new InvalidOperationException($"Client for update with ID {id} not found.");
            }

            if (dto.FirstName != null)
                updateClient.FirstName = dto.FirstName;

            if (dto.LastName != null)
                updateClient.LastName = dto.LastName;

            if (dto.Email != null)
                updateClient.Email = dto.Email;

            if (dto.Phone != null)
                updateClient.Phone = dto.Phone;

            if (dto.Status != null)
                updateClient.Status = dto.Status;

            if (dto.AssignedEmployeeId.HasValue)
                updateClient.AssignedEmployeeId = dto.AssignedEmployeeId.Value;

            await _context.SaveChangesAsync();

            return updateClient;
        }
    }
}