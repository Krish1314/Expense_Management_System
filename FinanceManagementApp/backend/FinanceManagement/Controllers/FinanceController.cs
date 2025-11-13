using Microsoft.AspNetCore.Mvc;
using FinanceManagement.DTOs;
using FinanceManagement.Services;

namespace FinanceManagement.Controllers
{
    [Route("api/finance")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly FinanceService _service;

        public FinanceController(FinanceService service)
        {
            _service = service;
        }

        [HttpGet("summary")]
        public IActionResult GetSummary() => Ok(_service.GetDashboardSummary());

        [HttpGet("annual-breakdown")]
        public IActionResult GetAnnualBreakdown() => Ok(_service.GetAnnualExpenseBreakdown());

        [HttpGet("team-summary")]
        public IActionResult GetTeamSummary() => Ok(_service.GetTeamWiseExpense());

        [HttpGet("submissions/recent")]
        public IActionResult GetRecentExpenses() => Ok(_service.GetRecentExpenses());

        [HttpGet("submission/{id}")]
        public IActionResult GetExpenseDetails(int id) => Ok(_service.GetExpenseDetails(id));

        [HttpPost("submission/{id}/status")]
        public IActionResult UpdateExpenseStatus(int id, [FromBody] ExpenseStatusDto dto)
        {
            _service.UpdateExpenseStatus(id, dto.Status);
            return Ok();
        }

        [HttpGet("submission/{id}/receipt")]
        public IActionResult GetExpenseReceipt(int id) => Ok(new { url = _service.GetExpenseReceiptUrl(id) });

        [HttpGet("submissions")]
        public IActionResult GetExpensesByFilter([FromQuery] ExpenseFilterDto filter)
            => Ok(_service.GetExpensesByFilter(filter));

        [HttpPost("submission/new")]
        public IActionResult AddNewExpense([FromBody] ExpenseDto dto)
        {
            _service.AddExpense(dto);
            return Ok();
        }
    }
}
