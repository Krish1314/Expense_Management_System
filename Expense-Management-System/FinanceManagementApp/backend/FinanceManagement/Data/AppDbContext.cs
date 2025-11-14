using Microsoft.EntityFrameworkCore;
using FinanceManagement.Models;

namespace FinanceManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Expense> Expenses { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensure quoted PascalCase tables to match existing DB
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Expense>().ToTable("Expenses");

            // Store DateSubmitted without timezone to avoid UTC Kind enforcement
            modelBuilder.Entity<Expense>()
                .Property(e => e.DateSubmitted)
                .HasColumnType("timestamp without time zone");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Fallback provider when DI not used: PostgreSQL
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=finance_db;Username=postgres;Password=yourCookie@1439;");
            }
        }
    }
}
