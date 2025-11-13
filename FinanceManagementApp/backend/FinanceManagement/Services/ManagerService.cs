using FinanceManagement.Data;
using FinanceManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FinanceManagement.Services
{
    public class ManagerService
    {
        private readonly AppDbContext _context;

        // Inject AppDbContext to access real DB
        public ManagerService(AppDbContext context)
        {
            _context = context;
        }

        // Get all expenses of team
        public List<Expense> GetAllTeamExpenses()
        {
            return _context.Expenses.ToList();
        }

        // Get single expense by Id
        public Expense GetExpenseDetail(int id)
        {
            return _context.Expenses.FirstOrDefault(e => e.Id == id);
        }

        // Approve an expense
        public bool ApproveExpense(int id)
        {
            var expense = _context.Expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
                return false;

            expense.Status = "Approved";
            _context.SaveChanges();
            return true;
        }

        // Reject an expense
        public bool RejectExpense(int id)
        {
            var expense = _context.Expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
                return false;

            expense.Status = "Rejected";
            _context.SaveChanges();
            return true;
        }

        // Generate simple report
        public List<string> GetReports()
        {
            var approved = _context.Expenses.Count(e => e.Status == "Approved");
            var pending = _context.Expenses.Count(e => e.Status == "Pending");
            var rejected = _context.Expenses.Count(e => e.Status == "Rejected");

            return new List<string> {
                $"Approved: {approved}",
                $"Pending: {pending}",
                $"Rejected: {rejected}"
            };
        }

        // Export expenses as CSV
        public byte[] ExportExpensesToCsv()
        {
            var expenses = _context.Expenses.ToList();
            var csvBuilder = new StringBuilder();
            csvBuilder.AppendLine("ID,Title,Amount,Status,DateSubmitted");
            foreach (var e in expenses)
            {
                csvBuilder.AppendLine($"{e.Id},{e.Title},{e.Amount},{e.Status},{e.DateSubmitted}");
            }

            return Encoding.UTF8.GetBytes(csvBuilder.ToString());
        }
    }
}
