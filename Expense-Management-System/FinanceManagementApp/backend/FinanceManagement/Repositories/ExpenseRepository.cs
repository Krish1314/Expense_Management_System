using Microsoft.EntityFrameworkCore;
using FinanceManagement.Data;
using FinanceManagement.Models;

namespace FinanceManagement.Repositories
{
    public class ExpenseRepository
    {
        private readonly AppDbContext _context;

        public ExpenseRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Expense> GetRecentExpenses(int count = 10)
        {
            return _context.Expenses
                .OrderByDescending(e => e.DateSubmitted)
                .Take(count)
                .Include(e => e.EmployeeId)
                .ToList();
        }

        public Expense GetExpenseById(int id)
        {
            return _context.Expenses.Include(e => e.EmployeeId).FirstOrDefault(e => e.Id == id);
        }

        public void UpdateExpenseStatus(int id, string status)
        {
            var exp = _context.Expenses.Find(id);
            if (exp != null)
            {
                exp.Status = status;
                _context.SaveChanges();
            }
        }
    }

}
