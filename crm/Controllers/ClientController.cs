using crm.dto;
using crm.dto.client;
using crm.dto.device;
using crm.Models;
using crm.Services.client;
using Microsoft.AspNetCore.Mvc;

namespace crm.Controllers
{
    [ApiController]
    [Route("client")]
    public class ClientController : Controller
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateClient([FromBody] ClientCreateDTO body)
        {
            if (body == null)
                return BadRequest("Request body is null.");

            try
            {
                var client = await _clientService.CreateClient(body);

                if (client == null)
                {
                    return BadRequest("Body is null.");
                }

           
                return CreatedAtAction(nameof(ReadClientById), new { id = client.Id }, client);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> ReadClientById(int id)
        {
            var client = await _clientService.ReadClientById(id);
            if (client == null)
            {
                return NotFound($"Client with id {id} not found.");
            }

            var response = new ClientReadDTOResponse
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Email = client.Email,
                Phone = client.Phone,
                Status = client.Status,
                AssignedEmployeeId = client.AssignedEmployeeId,
                Devices = client.Devices.Select(d => new DeviceDTO
                {
                    Id = d.Id,
                    SerialNumber = d.SerialNumber,
                    DeviceType = d.DeviceType,
                    Model = d.Model,
                    Note = d.Notes
                }).ToList()
            };

            return Ok(response);
        }

        [HttpGet("get")]
        public async Task<IActionResult> ReadAllClients()
        {
            var clients = await _clientService.ReadAllClients();

            var response = clients.Select(c => new ClientReadDTOResponse
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                Phone = c.Phone,
                Status = c.Status,
                AssignedEmployeeId = c.AssignedEmployeeId,
                Devices = c.Devices.Select(d => new DeviceDTO
                {
                    Id = d.Id,
                    SerialNumber = d.SerialNumber,
                    DeviceType = d.DeviceType,
                    Model = d.Model,
                    Note = d.Notes
                }).ToList()
            });             

            return Ok(response);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteClientById(int id)
        {
            try
            {
                var deleteClient = await _clientService.DeleteClientById(id);

                if (!deleteClient)
                {
                    return NotFound($"Employee with ID {id} not found.");
                }
                else
                {
                    return NoContent();
                }

            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while attempting to delete the employee.");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEmployeeById([FromBody] ClientUpdateDTO request, int id)
        {
            try
            {
                var updateClient = await _clientService.UpdateClientById(request, id);

                if (updateClient == null)
                {
                    return NotFound($"Client for update with id {id} not found.");
                }

                var response = new ClientUpdateDTOResponse
                {
                    Id = updateClient.Id,
                    FirstName = updateClient.FirstName,
                    LastName = updateClient.LastName,
                    Email = updateClient.Email,
                    Phone = updateClient.Phone,
                    Status = updateClient.Status,
                    AssignedEmployeeId= updateClient.AssignedEmployeeId

                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }
    }
}
