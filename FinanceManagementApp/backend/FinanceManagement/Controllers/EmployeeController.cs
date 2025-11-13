using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using FinanceManagement.Models;
using FinanceManagement.Data;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace FinanceManagement.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        // LOGIN endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == login.Email && u.Password == login.Password);

            if (user == null)
                return Unauthorized(new { message = "Login failed" });

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }

        // PROFILE endpoint
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var profile = new
            {
                name = "John Doe",
                employeeId = "EMP-12345",
                email = "johndoe@abstract.com",
                role = "Employee",
                department = "Engineering",
                manager = "Jane Smith",
                phone = "+1 123-456-7890",
                address = "123 Main St",
                region = "North America",
                currency = "INR (₹)"
            };
            return Ok(profile);
        }

        // EXPENSE LIST endpoint (Updated)
        [HttpGet("expenses")]
        public IActionResult GetExpenses()
        {
            // DB se saare expenses fetch karo
            var expenses = _context.Expenses.ToList();

            return Ok(expenses);
        }

        // EXPENSE SUBMIT endpoint
        [HttpPost("expenses")]
        public IActionResult SubmitExpense([FromForm] Expense expense, IFormFile? receipt)
        {
            try
            {
                // Handle common binding issues: Date/Amount sent as strings
                if (expense.DateSubmitted == default)
                {
                    if (Request?.Form != null && Request.Form.TryGetValue("Date", out var dateVal))
                    {
                        if (DateTime.TryParse(dateVal, out var parsed))
                        {
                            expense.DateSubmitted = parsed;
                        }
                    }
                }

                if (expense.Amount == 0)
                {
                    if (Request?.Form != null && Request.Form.TryGetValue("Amount", out var amtVal))
                    {
                        if (decimal.TryParse(amtVal, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var amount))
                        {
                            expense.Amount = amount;
                        }
                    }
                }

                if (receipt != null && receipt.Length > 0)
                {
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/receipts");
                    Directory.CreateDirectory(folderPath);
                    var original = Path.GetFileName(receipt.FileName);
                    var ext = Path.GetExtension(original);
                    var fileName = $"{Guid.NewGuid():N}{ext}"; // safe, URL-friendly
                    var filePath = Path.Combine(folderPath, fileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    receipt.CopyTo(stream);
                    expense.receiptUrl = $"/receipts/{fileName}";
                }

                if (expense.Status == null) expense.Status = "Pending";
                if (expense.DateSubmitted == default)
                {
                    expense.DateSubmitted = DateTime.UtcNow;
                }
                else
                {
                    // Ensure DateTime has UTC kind for timestamptz columns
                    expense.DateSubmitted = DateTime.SpecifyKind(expense.DateSubmitted, DateTimeKind.Utc);
                }

                _context.Expenses.Add(expense);
                _context.SaveChanges();
                return Ok(new { message = "Expense submitted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // REIMBURSEMENT endpoint (Updated to fetch from DB)
        [HttpGet("reimbursement")]
        public IActionResult GetReimbursementStatus()
        {
            // DB se sabhi expenses fetch karo aur frontend format ke liye map karo
            var reimbursements = _context.Expenses
                .Select(e => new
                {
                    id = e.Id,
                    date = e.DateSubmitted.ToString("yyyy-MM-dd"),
                    desc = e.Title,
                    amount = e.Amount,
                    status = e.Status,
                    credited = e.Status == "Approved" ? e.DateSubmitted.ToString("MMM yyyy") : "-"
                })
                .ToList();

            return Ok(reimbursements);
        }
    }
}
