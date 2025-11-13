using Microsoft.AspNetCore.Mvc;
using FinanceManagement.Services;
using FinanceManagement.Data;

namespace FinanceManagement.Controllers
{
    [Route("api/manager")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly ManagerService _managerService;

        // Inject AppDbContext into ManagerService
        public ManagerController(AppDbContext context)
        {
            _managerService = new ManagerService(context);
        }

        [HttpGet("expenses")]
        public IActionResult GetAllTeamExpenses()
        {
            var expenses = _managerService.GetAllTeamExpenses();
            return Ok(expenses);
        }

        [HttpGet("expenses/{id}")]
        public IActionResult GetExpenseDetail(int id)
        {
            var expense = _managerService.GetExpenseDetail(id);
            if (expense == null)
                return NotFound("Expense not found.");
            return Ok(expense);
        }

        [HttpPost("expenses/{id}/approve")]
        public IActionResult ApproveExpense(int id)
        {
            bool result = _managerService.ApproveExpense(id);
            return Ok(result ? $"Expense {id} approved successfully." : "Approval failed.");
        }

        [HttpPost("expenses/{id}/reject")]
        public IActionResult RejectExpense(int id)
        {
            bool result = _managerService.RejectExpense(id);
            return Ok(result ? $"Expense {id} rejected successfully." : "Rejection failed.");
        }

        [HttpGet("reports")]
        public IActionResult GetReports()
        {
            var reports = _managerService.GetReports();
            return Ok(reports);
        }

        [HttpGet("expenses/export")]
        public IActionResult ExportExpenses()
        {
            var fileContents = _managerService.ExportExpensesToCsv();
            return File(fileContents, "text/csv", "expenses_export.csv");
        }
    }
}
