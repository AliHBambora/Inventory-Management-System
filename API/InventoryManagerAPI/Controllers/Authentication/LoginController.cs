using InventoryManagerAPI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace InventoryManagerAPI.Controllers.Authentication
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IJwtAuthenticationManager jwtAuthenticationManager;

        public LoginController(IJwtAuthenticationManager jwtAuthenticationManager)
        {
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult Login()
        {
            var username = Request.Form["username"];
            var password = Request.Form["password"];
            var result = jwtAuthenticationManager.Authenticate(username, password);
            if (result[0] == "fail")
            {
                return Unauthorized(result[1]);
            }
            return Ok(new { status = "success", result = result[1] });
        }
    }
}
