using FinanceManagement.Data;
using FinanceManagement.Services;
using Microsoft.EntityFrameworkCore;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// -----------------------------
// CORS Policy: Allow React frontend to call backend
// -----------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // <-- React app URL
                  .AllowAnyMethod() // GET, POST, PUT, DELETE
                  .AllowAnyHeader(); // Allow headers like Content-Type, Authorization
        });
});

// -----------------------------
// Database configuration
// -----------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// -----------------------------
// Dependency Injection for services
// -----------------------------
builder.Services.AddScoped<FinanceService>();

// Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// -----------------------------
// Middleware pipeline
// -----------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Use CORS policy
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();

