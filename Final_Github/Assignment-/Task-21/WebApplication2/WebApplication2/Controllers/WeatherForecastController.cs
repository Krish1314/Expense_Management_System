using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WeatherForecastController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/WeatherForecast
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WeatherForecast>>> GetForecasts()
        {
            return await _context.WeatherForecasts.ToListAsync();
        }

        // GET: api/WeatherForecast/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WeatherForecast>> GetForecast(int id)
        {
            var forecast = await _context.WeatherForecasts.FindAsync(id);
            if (forecast == null)
                return NotFound();

            return forecast;
        }

        // POST: api/WeatherForecast
        [HttpPost]
        public async Task<ActionResult<WeatherForecast>> PostForecast(WeatherForecast forecast)
        {
            _context.WeatherForecasts.Add(forecast);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetForecast), new { id = forecast.Id }, forecast);
        }

        // PUT: api/WeatherForecast/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForecast(int id, WeatherForecast forecast)
        {
            if (id != forecast.Id)
                return BadRequest();

            _context.Entry(forecast).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/WeatherForecast/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForecast(int id)
        {
            var forecast = await _context.WeatherForecasts.FindAsync(id);
            if (forecast == null)
                return NotFound();

            _context.WeatherForecasts.Remove(forecast);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
