using crm.dto.client;
using crm.Models;

namespace crm.Services.client
{
    public interface IClientService
    {
        Task<Client?> CreateClient(ClientCreateDTO client);
        Task<Client?> ReadClientById(int id);

        Task<List<Client>> ReadAllClients();

        Task<bool> DeleteClientById(int id);

        Task<Client?> UpdateClientById(ClientUpdateDTO client, int id);

    }
}
