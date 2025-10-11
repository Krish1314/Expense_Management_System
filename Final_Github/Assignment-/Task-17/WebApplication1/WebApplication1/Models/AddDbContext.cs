using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models
{
    public class AddDbContext : DbContext
    {
        public AddDbContext(DbContextOptions<AddDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; } // Example model
    }
}