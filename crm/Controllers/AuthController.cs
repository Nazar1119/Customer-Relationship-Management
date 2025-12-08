using crm.Models;
using Microsoft.AspNetCore.Mvc;
using crm.dto;
using crm.Services.auth;

namespace crm.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : Controller
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var httpRes = await _auth.Login(request.Email, request.Password);

            if (httpRes == null)
            {
                return Unauthorized();
            }

            var token = _auth.GenerateJwt(httpRes);

            return Ok(new
            {
                Token = token,
                UserData = new
                {
                    httpRes.Id,
                    httpRes.FirstName,
                    httpRes.LastName,
                    httpRes.Email,
                    httpRes.Role,
                    httpRes.Department,
                    httpRes.Phone
                }
            });
        }
    }
}
