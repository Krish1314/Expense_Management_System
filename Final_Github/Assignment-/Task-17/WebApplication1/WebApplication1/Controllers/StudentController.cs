using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Controllers
{
    public class StudentController : Controller
    {
        private readonly AddDbContext _context;

        public StudentController(AddDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var students = _context.Students.ToList();
            return View(students);
        }

        // Removed CRUD actions; keeping only Index to list students
    }
}