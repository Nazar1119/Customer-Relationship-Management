using crm.dto.device;
using crm.Services.device;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;


namespace crm.Controllers
{
    [ApiController]
    [Route("devices")]
    public class DeviceController : Controller
    {
        private readonly IDeviceService _deviceService;

        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        [HttpPost("create/{clientId}")]
        public async Task<IActionResult> CreateDeviceByClientId([FromBody] DeviceCreateDTO request, int clientId)
        {
            try
            {
                var device = await _deviceService.CreateDeviceByClientId(request, clientId);

                var response = new DeviceCreateDTOResponse
                {
                    Id = device.Id,
                    SerialNumber = device.SerialNumber,
                    DeviceType = device.DeviceType,
                    Model = device.Model,
                    Notes = device.Notes
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDeviceById(DeviceUpdateDTO request, int id)
        {
            try
            {
                var device = await _deviceService.UpdateDeviceById(request, id);
                if (device == null)
                {
                    return NotFound($"Employee for update with id {id} not found.");
                }

                var response = new DeviceUpdateDTOResponse
                {
                    Id = device.Id,
                    SerialNumber = device.SerialNumber,
                    DeviceType = device.DeviceType,
                    Model = device.Model,
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

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteDeviceById(int id)
        {
            try
            {
                var request = await _deviceService.DeleteDeviceById(id);

                if (!request)
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

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetDeviceById(int id)
        {
            var device = await _deviceService.ReadDeviceById(id);

            if (device == null)
            {
                return NotFound($"Device with id {id} not found.");
            }

            var response = new DeviceCreateDTOResponse
            {
                Id = device.Id,
                SerialNumber = device.SerialNumber,
                DeviceType = device.DeviceType,
                Model = device.Model,
                Notes = device.Notes,
            };

            return Ok(response);

        }

        [HttpGet("get")]
        public async Task<IActionResult> GetAllDevices()
        {
            var device = await _deviceService.ReadAllDevices();


            var response = device.Select(e => new DeviceCreateDTOResponse
            {
                Id = e.Id,
                SerialNumber = e.SerialNumber,
                DeviceType = e.DeviceType,
                Model = e.Model,
                Notes = e.Notes,
            }).ToList();

            return Ok(response);
        }


        [HttpGet("get/special/{clientId}")]
        public async Task<IActionResult> GetAllDevicesWithClientId(int clientId)
        {
            var devices = await _deviceService.ReadAllDevicesByClientId(clientId);

            var response = devices.Select(e => new DeviceReadWithClientIdResponse
            {
                Id = e.Id,
                SerialNumber = e.SerialNumber,
                DeviceType = e.DeviceType,
                Model = e.Model,
                Notes = e.Notes,
                ClientId = e.ClientId,
            }).ToList();

            return Ok(response);
        }


    }
}
