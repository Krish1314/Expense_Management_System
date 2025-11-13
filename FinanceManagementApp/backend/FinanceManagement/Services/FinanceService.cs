using FinanceManagement.Models;
using FinanceManagement.DTOs;
using FinanceManagement.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace FinanceManagement.Services
{
    public class FinanceService
    {
        private readonly AppDbContext _context;

        public FinanceService(AppDbContext context)
        {
            _context = context;
        }

        public ExpenseSummaryDto GetDashboardSummary()
        {
            var pending = _context.Expenses.Where(e => e.Status == "Pending").Sum(e => e.Amount);
            var approved = _context.Expenses.Where(e => e.Status == "Approved" || e.Status == "Credited").Sum(e => e.Amount);
            var monthCount = _context.Expenses.Count(e => e.DateSubmitted.Month == DateTime.Now.Month && e.DateSubmitted.Year == DateTime.Now.Year);

            return new ExpenseSummaryDto
            {
                PendingTotal = pending,
                ApprovedTotal = approved,
                SubmissionsCount = monthCount
            };
        }

        public IEnumerable<object> GetAnnualExpenseBreakdown()
        {
            return _context.Expenses
                .GroupBy(e => e.DateSubmitted.Month)
                .Select(g => new { Month = g.Key, Total = g.Sum(e => e.Amount) })
                .OrderBy(x => x.Month)
                .ToList();
        }

        public IEnumerable<object> GetTeamWiseExpense()
        {
            return _context.Expenses
                .GroupBy(e => e.Role)
                .Select(g => new { Team = g.Key, Total = g.Sum(e => e.Amount) })
                .ToList();
        }

        public List<ExpenseDto> GetRecentExpenses()
        {
            var query = _context.Expenses
                .OrderByDescending(e => e.DateSubmitted)
                .Take(10)
                .Join(_context.Users,
                      exp => exp.EmployeeId,
                      user => user.Id,
                      (exp, user) => new ExpenseDto
                      {
                          Id = exp.Id,
                          Title = exp.Title,
                          Amount = exp.Amount,
                          Status = exp.Status,
                          DateSubmitted = exp.DateSubmitted,
                          EmployeeName = user.Name,
                          Role = exp.Role,
                          ReceiptUrl = exp.receiptUrl,
                          Category = exp.Category
                      });
            return query.ToList();
        }

        public ExpenseDto GetExpenseDetails(int id)
        {
            var data = _context.Expenses
                .Where(exp => exp.Id == id)
                .Join(_context.Users,
                      exp => exp.EmployeeId,
                      user => user.Id,
                      (exp, user) => new ExpenseDto
                      {
                          Id = exp.Id,
                          Title = exp.Title,
                          Amount = exp.Amount,
                          Status = exp.Status,
                          DateSubmitted = exp.DateSubmitted,
                          EmployeeName = user.Name,
                          Role = exp.Role,
                          ReceiptUrl = exp.receiptUrl,
                          Category = exp.Category
                      }).FirstOrDefault();

            return data;
        }

        public void UpdateExpenseStatus(int expenseId, string newStatus)
        {
            var exp = _context.Expenses.FirstOrDefault(e => e.Id == expenseId);
            if (exp != null)
            {
                exp.Status = newStatus;
                _context.SaveChanges();
            }
        }

        public string GetExpenseReceiptUrl(int id)
        {
            return _context.Expenses.FirstOrDefault(e => e.Id == id)?.receiptUrl;
        }

        public IEnumerable<ExpenseDto> GetExpensesByFilter(ExpenseFilterDto filter)
        {
            var query = _context.Expenses.AsQueryable();
            if (!string.IsNullOrEmpty(filter.Team))
                query = query.Where(e => e.Role == filter.Team);

            if (filter.DateFrom.HasValue)
                query = query.Where(e => e.DateSubmitted >= filter.DateFrom.Value);

            if (filter.DateTo.HasValue)
                query = query.Where(e => e.DateSubmitted <= filter.DateTo.Value);

            if (!string.IsNullOrEmpty(filter.Status))
                query = query.Where(e => e.Status == filter.Status);

            var finalQuery = query.Join(_context.Users,
                        exp => exp.EmployeeId,
                        user => user.Id,
                        (exp, user) => new ExpenseDto
                        {
                            Id = exp.Id,
                            Title = exp.Title,
                            Amount = exp.Amount,
                            Status = exp.Status,
                            DateSubmitted = exp.DateSubmitted,
                            EmployeeName = user.Name,
                            Role = exp.Role,
                            ReceiptUrl = exp.receiptUrl,
                            Category = exp.Category
                        });

            return finalQuery.ToList();
        }

        public void AddExpense(ExpenseDto dto)
        {
            var emp = _context.Users.FirstOrDefault(u => u.Name == dto.EmployeeName && u.Role == dto.Role);
            if (emp == null)
                throw new ArgumentException($"Employee '{dto.EmployeeName}' in Role '{dto.Role}' not found.");

            var exp = new Expense
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Status = "Pending",
                DateSubmitted = DateTime.Now,
                EmployeeId = emp.Id,
                Role = dto.Role,
                receiptUrl = dto.ReceiptUrl,
                Category = dto.Category
            };
            _context.Expenses.Add(exp);
            _context.SaveChanges();
        }
    }
}
