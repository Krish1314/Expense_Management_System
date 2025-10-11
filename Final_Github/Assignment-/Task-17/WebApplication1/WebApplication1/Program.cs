using Microsoft.EntityFrameworkCore;
using WebApplication1.Models; // Make sure your DbContext and Models are inside this namespace

var builder = WebApplication.CreateBuilder(args);

// ✅ Add DbContext (PostgreSQL)
builder.Services.AddDbContext<AddDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Add MVC support (Controllers + Views)
builder.Services.AddControllersWithViews();

var app = builder.Build();

// ✅ Configure HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// ✅ Default Route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Student}/{action=Index}/{id?}");

// ✅ Run the app
app.Run();