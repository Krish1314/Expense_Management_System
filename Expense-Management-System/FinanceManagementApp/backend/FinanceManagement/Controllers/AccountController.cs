using Microsoft.AspNetCore.Mvc;
using FinanceManagement.Data;   // Aapke Data namespace ka naam
using FinanceManagement.Models; // Aapke Models namespace ka naam
using System.Linq;

namespace FinanceManagement.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            // User ko database me email aur password se check karo
            var user = _context.Users.FirstOrDefault(u =>
                u.Email == login.Email && u.Password == login.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // User mil gaya, user ka info aur Role bhej do frontend ko
            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            });
        }
    }
}
